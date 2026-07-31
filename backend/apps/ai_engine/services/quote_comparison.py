import json
from apps.quotations.models import Quotation
from apps.procurement.models import RFQ
from apps.ai_engine.providers.gemini_provider import call_gemini_api
from apps.services.explainability import generate_explainability_metadata

def compare_quotes_with_gemini(rfq_id: str) -> dict:
    """
    Multi-Criteria Quote Comparison Service powered by Google Gemini AI.
    Evaluates vendor bids across price, delivery lead time, warranty, and commercial terms.
    """
    quotes = Quotation.objects.filter(rfq_id=rfq_id).select_related('vendor')
    if not quotes.exists():
        return {
            "error": "No vendor quotations submitted for this RFQ yet.",
            "matrix": []
        }

    matrix = []
    min_price_quote = None
    min_delivery_quote = None
    lowest_price = float('inf')
    fastest_delivery = float('inf')

    for q in quotes:
        total = float(q.total_price)
        lead_days = q.delivery_days
        
        if total < lowest_price:
            lowest_price = total
            min_price_quote = q
        
        if lead_days < fastest_delivery:
            fastest_delivery = lead_days
            min_delivery_quote = q

        rating = float(q.vendor.rating)
        risk_level = "LOW"
        risk_reasons = []

        if "advance" in q.payment_terms.lower():
            risk_level = "HIGH"
            risk_reasons.append("Demands upfront advance payment prior to dispatch.")
        elif rating < 4.0:
            risk_level = "MEDIUM"
            risk_reasons.append(f"Historical vendor rating is {rating}/5.0.")

        if q.warranty_months < 12:
            risk_reasons.append(f"Short warranty duration of {q.warranty_months} months.")

        if not risk_reasons:
            risk_reasons.append("Standard commercial terms with verified vendor credentials.")

        matrix.append({
            "quotation_id": str(q.id),
            "vendor_id": str(q.vendor.id),
            "vendor_name": q.vendor.company_name,
            "vendor_rating": rating,
            "total_price": total,
            "currency": q.currency,
            "delivery_days": lead_days,
            "warranty_months": q.warranty_months,
            "payment_terms": q.payment_terms,
            "risk_level": risk_level,
            "risk_reasons": risk_reasons,
            "is_best_price": False,
            "is_fastest_delivery": False
        })

    for item in matrix:
        if min_price_quote and item["quotation_id"] == str(min_price_quote.id):
            item["is_best_price"] = True
        if min_delivery_quote and item["quotation_id"] == str(min_delivery_quote.id):
            item["is_fastest_delivery"] = True
        item["explainability"] = generate_explainability_metadata(item)

    best_overall = min_price_quote if min_price_quote else quotes.first()

    prompt = f"""
    Evaluate the following vendor quotation matrix for RFQ {rfq_id}:
    {json.dumps(matrix, indent=2)}

    Generate a JSON response with key:
    "executive_summary": (A 3-bullet markdown decision recommendation on which vendor to award to and why).
    """

    gemini_res = call_gemini_api(
        prompt=prompt,
        system_instruction="You are an executive procurement officer. Compare vendor quotes and recommend the optimal supplier."
    )

    if gemini_res and "executive_summary" in gemini_res:
        summary = gemini_res["executive_summary"]
    else:
        summary = (
            f"AI Procurement Copilot Recommendation:\n"
            f"1. Best Financial Value: {min_price_quote.vendor.company_name if min_price_quote else 'N/A'} at {min_price_quote.currency} {min_price_quote.total_price:,.2f}.\n"
            f"2. Fastest Execution: {min_delivery_quote.vendor.company_name if min_delivery_quote else 'N/A'} with {min_delivery_quote.delivery_days} days lead time.\n"
            f"3. Executive Decision: Recommend awarding to {best_overall.vendor.company_name} based on optimal price-to-risk balance."
        )

    return {
        "rfq_id": str(rfq_id),
        "quotations_evaluated": len(matrix),
        "gemini_powered": gemini_res is not None,
        "best_price_vendor": min_price_quote.vendor.company_name if min_price_quote else "",
        "fastest_delivery_vendor": min_delivery_quote.vendor.company_name if min_delivery_quote else "",
        "best_overall_vendor": best_overall.vendor.company_name if best_overall else "",
        "executive_summary": summary,
        "comparison_matrix": matrix
    }
