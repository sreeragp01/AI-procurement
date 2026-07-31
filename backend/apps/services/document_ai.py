from apps.ai_engine.services.document_extraction import extract_document_with_gemini

def extract_quotation_pdf_data(pdf_path_or_file) -> dict:
    """
    Structured AI Document Extraction Pipeline delegating to Google Gemini AI provider.
    """
    return extract_document_with_gemini(pdf_path_or_file)
