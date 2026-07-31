from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from apps.vendors.models import Vendor
from apps.procurement.models import PurchaseRequest, RFQ, PurchaseOrder
from apps.contracts.models import Contract

class DashboardMetricsView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        active_vendors_count = Vendor.objects.count()
        pending_prs_count = PurchaseRequest.objects.filter(status='PENDING_APPROVAL').count()
        active_rfqs_count = RFQ.objects.filter(status='PUBLISHED').count()
        active_orders_count = PurchaseOrder.objects.exclude(status='COMPLETED').count()

        # Spend charts mock / aggregates
        monthly_spend = [
            {"month": "Jan", "spend": 1200000, "savings": 140000},
            {"month": "Feb", "spend": 1850000, "savings": 210000},
            {"month": "Mar", "spend": 1400000, "savings": 190000},
            {"month": "Apr", "spend": 2100000, "savings": 280000},
            {"month": "May", "spend": 2600000, "savings": 350000},
            {"month": "Jun", "spend": 3100000, "savings": 420000},
        ]

        category_distribution = [
            {"name": "IT & Hardware", "value": 42},
            {"name": "Office Supplies", "value": 18},
            {"name": "Raw Materials", "value": 25},
            {"name": "Services & Maintenance", "value": 15},
        ]

        return Response({
            "kpis": {
                "total_spend_ytd": 12250000,
                "cost_savings_ytd": 1590000,
                "active_vendors": active_vendors_count or 8,
                "pending_prs": pending_prs_count or 3,
                "active_rfqs": active_rfqs_count or 2,
                "active_orders": active_orders_count or 4,
            },
            "monthly_spend_trend": monthly_spend,
            "category_distribution": category_distribution,
        }, status=status.HTTP_200_OK)
