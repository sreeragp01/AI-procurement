from datetime import timedelta
from django.utils import timezone
from apps.procurement.models import PurchaseRequest

def detect_duplicate_purchase_requests(title: str, category_id, threshold_days: int = 30) -> list:
    """
    Detects if a similar Purchase Request was created within the last N days.
    Prevents duplicate item orders across departments.
    """
    cutoff = timezone.now() - timedelta(days=threshold_days)
    recent_prs = PurchaseRequest.objects.filter(
        created_at__gte=cutoff
    ).exclude(status=PurchaseRequest.Status.REJECTED)

    if category_id:
        recent_prs = recent_prs.filter(category_id=category_id)

    duplicates = []
    title_lower = title.lower()

    for pr in recent_prs:
        # Check title similarity or key tokens
        words = set(title_lower.split())
        pr_words = set(pr.title.lower().split())
        overlap = words.intersection(pr_words)
        
        if len(overlap) >= 2 or title_lower in pr.title.lower() or pr.title.lower() in title_lower:
            duplicates.append({
                'id': str(pr.id),
                'request_number': pr.request_number,
                'title': pr.title,
                'total_budget': float(pr.total_budget),
                'created_by': pr.created_by.email,
                'created_at': pr.created_at.strftime('%Y-%m-%d'),
                'status': pr.status
            })

    return duplicates

def validate_purchase_request_budget(department, amount) -> dict:
    """
    Validates whether the requested amount is within the department's remaining annual budget.
    """
    if not department:
        return {'is_valid': True, 'warning': None}

    annual_budget = float(department.annual_budget)
    existing_spend = sum([float(pr.total_budget) for pr in department.purchase_requests.exclude(status=PurchaseRequest.Status.REJECTED)])
    
    remaining = annual_budget - existing_spend
    
    if float(amount) > remaining:
        return {
            'is_valid': False,
            'remaining_budget': remaining,
            'warning': f"Requested amount (₹{float(amount):,.2f}) exceeds remaining department budget (₹{remaining:,.2f}). Requires Finance Exception Approval."
        }

    return {
        'is_valid': True,
        'remaining_budget': remaining,
        'warning': None
    }
