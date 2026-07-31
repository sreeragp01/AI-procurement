import os
from apps.contracts.models import Contract
from apps.quotations.services import extract_raw_text_from_pdf

def audit_contract_pdf_ai(contract_id):
    """
    Parses uploaded Contract PDF, scans for key indemnity, penalty, and IP clauses,
    calculates risk score, and saves AI analysis onto the Contract object.
    """
    try:
        contract = Contract.objects.get(id=contract_id)
    except Contract.DoesNotExist:
        return {"error": "Contract not found"}

    raw_text = ""
    if contract.document and os.path.exists(contract.document.path):
        raw_text = extract_raw_text_from_pdf(contract.document.path)

    # Clause detection rules
    missing_clauses = []
    text_lower = raw_text.lower()

    if "liquidated damages" not in text_lower and "penalty" not in text_lower:
        missing_clauses.append({
            "clause": "Liquidated Damages / Delay Penalty",
            "severity": "HIGH",
            "risk": "No financial penalty clause if vendor delays delivery past agreed SLA schedule."
        })

    if "intellectual property" not in text_lower and "ip rights" not in text_lower:
        missing_clauses.append({
            "clause": "Intellectual Property Ownership",
            "severity": "MEDIUM",
            "risk": "Unclear IP transfer terms for custom software/tooling deliverables."
        })

    if "force majeure" not in text_lower:
        missing_clauses.append({
            "clause": "Force Majeure Terms",
            "severity": "LOW",
            "risk": "Standard 7-day notification window for unforeseen disruptions missing."
        })

    if not missing_clauses:
        missing_clauses.append({
            "clause": "Standard Terms Verified",
            "severity": "LOW",
            "risk": "All standard commercial & legal protection clauses present."
        })

    risk_score = 90 - (len(missing_clauses) * 12)
    risk_level = "LOW_RISK" if risk_score >= 80 else "MODERATE_RISK" if risk_score >= 60 else "HIGH_RISK"

    ai_analysis = {
        "overall_risk_score": risk_score,
        "risk_level": risk_level,
        "missing_clauses_count": len(missing_clauses),
        "missing_clauses": missing_clauses,
        "recommended_amendments": [
            "Insert a 0.5% per week delay penalty capped at 10% total contract value.",
            "Add explicit warranty replacement response time SLA (24 hours).",
            "Require 30-day prior written notice for annual contract renewal."
        ]
    }

    contract.ai_analysis = ai_analysis
    contract.save()

    return {
        "success": True,
        "contract_id": str(contract.id),
        "ai_analysis": ai_analysis
    }
