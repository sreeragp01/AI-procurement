from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    OrganizationViewSet, DepartmentViewSet, WorkflowRuleViewSet,
    NotificationViewSet, PurchaseRequestViewSet, PurchaseRequestItemViewSet,
    ApprovalRuleViewSet, ApprovalLogViewSet, RFQViewSet,
    VendorInvitationViewSet, PurchaseOrderViewSet, GoodsReceiptViewSet,
    InvoiceViewSet, PaymentViewSet
)

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet)
router.register(r'departments', DepartmentViewSet)
router.register(r'workflow-rules', WorkflowRuleViewSet)
router.register(r'notifications', NotificationViewSet)
router.register(r'purchase-requests', PurchaseRequestViewSet)
router.register(r'request-items', PurchaseRequestItemViewSet)
router.register(r'approval-rules', ApprovalRuleViewSet)
router.register(r'approval-logs', ApprovalLogViewSet)
router.register(r'rfqs', RFQViewSet)
router.register(r'vendor-invitations', VendorInvitationViewSet)
router.register(r'purchase-orders', PurchaseOrderViewSet)
router.register(r'goods-receipts', GoodsReceiptViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
