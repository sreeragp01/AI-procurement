from datetime import date, timedelta
from apps.contracts.models import Contract
from apps.procurement.models import Notification

def get_expiring_contracts(days_ahead: int = 30) -> list:
    """
    Finds active contracts expiring within N days.
    Generates contract renewal intelligence & vendor recommendations.
    """
    today = date.today()
    target_date = today + timedelta(days=days_ahead)

    contracts = Contract.objects.filter(
        status='ACTIVE',
        end_date__lte=target_date,
        end_date__gte=today
    )

    results = []
    for contract in contracts:
        days_left = (contract.end_date - today).days
        
        rec_action = "Initiate RFQ for competitive bidding"
        if contract.vendor and contract.vendor.rating >= 4.5:
            rec_action = f"Renew contract with preferred vendor {contract.vendor.company_name} (Rating: {contract.vendor.rating}★)"
        
        results.append({
            'contract_id': str(contract.id),
            'title': contract.title,
            'vendor_name': contract.vendor.company_name if contract.vendor else "N/A",
            'contract_number': getattr(contract, 'contract_number', 'CNT-2026-001'),
            'value': float(contract.value),
            'end_date': contract.end_date.strftime('%Y-%m-%d'),
            'days_until_expiration': days_left,
            'ai_recommended_action': rec_action
        })

        # Generate in-app alert notification if not already notified
        Notification.objects.get_or_create(
            title=f"Contract Renewal Alert: {contract.title}",
            defaults={
                'message': f"Contract with {contract.vendor.company_name if contract.vendor else 'Vendor'} expires in {days_left} days. Action: {rec_action}",
                'notification_type': Notification.Type.CONTRACT_EXPIRING,
                'link': '/contracts'
            }
        )

    return results
