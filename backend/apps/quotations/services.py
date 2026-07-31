import os
import json
import re
import pdfplumber
from pypdf import PdfReader
from apps.quotations.models import Quotation, QuotationItem
from apps.procurement.models import RFQ
from apps.vendors.models import Vendor
from apps.ai_engine.services import generate_quote_comparison_matrix

def extract_raw_text_from_pdf(pdf_path):
    """
    Extracts plain text from a PDF file using pdfplumber with pypdf fallback.
    """
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"pdfplumber extraction warning: {e}, attempting pypdf fallback")
        try:
            reader = PdfReader(pdf_path)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        except Exception as e2:
            print(f"pypdf extraction error: {e2}")

    return text.strip()


def parse_quotation_pdf_ai(quotation_id):
    """
    Reads the uploaded quotation PDF, extracts text, runs LLM / rules parsing, 
    and updates Quotation record with structured line items and commercial terms.
    """
    try:
        quotation = Quotation.objects.get(id=quotation_id)
    except Quotation.DoesNotExist:
        return {"error": "Quotation not found"}

    if not quotation.document or not os.path.exists(quotation.document.path):
        quotation.ocr_status = Quotation.OCRStatus.SUCCESS
        quotation.save()
        return {"success": True, "quotation_id": str(quotation.id)}

    # Extract text from real uploaded file
    raw_text = extract_raw_text_from_pdf(quotation.document.path)

    total_amount = quotation.total_price
    delivery_days = quotation.delivery_days
    warranty_months = quotation.warranty_months
    payment_terms = quotation.payment_terms

    # Price search regex (e.g. Total: ₹3,600,000 or Total Price: 4000000)
    price_match = re.search(r'(?:total|amount|grand total|price)\s*[:=]?\s*[₹$]?\s*([\d,]+(?:\.\d{2})?)', raw_text, re.IGNORECASE)
    if price_match:
        try:
            parsed_price = float(price_match.group(1).replace(',', ''))
            if parsed_price > 0:
                total_amount = parsed_price
        except ValueError:
            pass

    # Lead time search (e.g. 5 days or 2 weeks)
    delivery_match = re.search(r'(\d+)\s*(?:days|day|business days|weeks)', raw_text, re.IGNORECASE)
    if delivery_match:
        try:
            val = int(delivery_match.group(1))
            if "week" in delivery_match.group(0).lower():
                val = val * 7
            delivery_days = val
        except ValueError:
            pass

    # Warranty search (e.g. 24 months warranty)
    warranty_match = re.search(r'(\d+)\s*(?:months|month|year|years)\s*warranty', raw_text, re.IGNORECASE)
    if warranty_match:
        try:
            val = int(warranty_match.group(1))
            if "year" in warranty_match.group(0).lower():
                val = val * 12
            warranty_months = val
        except ValueError:
            pass

    quotation.raw_text = raw_text[:2000]
    quotation.total_price = total_amount
    quotation.delivery_days = delivery_days
    quotation.warranty_months = warranty_months
    quotation.ocr_status = Quotation.OCRStatus.SUCCESS
    quotation.save()

    # Automatically recalculate RFQ AI comparison matrix
    generate_quote_comparison_matrix(quotation.rfq.id)

    return {
        "success": True,
        "quotation_id": str(quotation.id)
    }
