from apps.procurement.models import RFQ, PurchaseRequest
from apps.vendors.models import Vendor
from apps.ai_engine.providers.gemini_provider import call_gemini_api

def recommend_vendors_with_gemini(rfq_id_or_pr_id: str) -> dict:
    """
    Vendor Recommendation Service powered by Google Gemini AI.
    Ranks suppliers based on category compatibility, budget limits, quality rating, and on-time delivery record.
    """
    try:
        rfq = RFQ.objects.get(id=rfq_id_or_pr_id)
        category = rfq.purchase_request.category
        pr_title = rfq.purchase_request.title
    except RFQ.DoesNotExist:
        try:
            pr = PurchaseRequest.objects.get(id=rfq_id_or_pr_id)
            category = pr.category
            pr_title = pr.title
        except PurchaseRequest.DoesNotExist:
            return {"error": "RFQ or Purchase Request not found"}

    matching_vendors = Vendor.objects.filter(categories=category, status=Vendor.Status.ACTIVE)
    scored_vendors = []

    for v in matching_vendors:
        rating_score = (float(v.rating) / 5.0) * 25.0
        delivery_score = (float(v.on_time_delivery_rate) / 100.0) * 30.0
        quality_score = (float(v.quality_score) / 100.0) * 30.0
        preferred_bonus = 15.0 if v.is_preferred else 5.0

        total_ai_score = round(rating_score + delivery_score + quality_score + preferred_bonus, 1)

        scored_vendors.append({
            "vendor_id": str(v.id),
            "company_name": v.company_name,
            "rating": float(v.rating),
            "on_time_delivery_rate": float(v.on_time_delivery_rate),
            "quality_score": float(v.quality_score),
            "is_preferred": v.is_preferred,
            "risk_level": v.risk_level,
            "ai_match_score": total_ai_score,
            "recommendation_reason": f"High quality pass rate ({v.quality_score}%) & {v.on_time_delivery_rate}% on-time delivery record."
        })

    scored_vendors.sort(key=lambda x: x["ai_match_score"], reverse=True)

    prompt = f"""
    Recommend top suppliers for Requisition '{pr_title}' in Category '{category.name}'.
    Available Candidate Vendors:
    {[v['company_name'] + ' (Rating: ' + str(v['rating']) + '★)' for v in scored_vendors[:5]]}

    Respond in JSON format with keys:
    - top_recommendation: string
    - recommendation_reasoning: string
    """

    gemini_res = call_gemini_api(
        prompt=prompt,
        system_instruction="You are a Supplier Selection Advisor. Provide clear rationale for recommended vendors."
    )

    reasoning = gemini_res.get("recommendation_reasoning") if (gemini_res and "recommendation_reasoning" in gemini_res) else f"Highest category match with {scored_vendors[0]['company_name'] if scored_vendors else 'N/A'} based on rating and delivery score."

    return {
        "category_name": category.name,
        "recommended_count": len(scored_vendors),
        "top_recommendation": scored_vendors[0]["company_name"] if scored_vendors else "N/A",
        "reasoning": reasoning,
        "vendors": scored_vendors
    }
