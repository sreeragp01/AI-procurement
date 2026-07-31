from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PurchaseRequestViewSet, 
    RFQViewSet, 
    PurchaseOrderViewSet,
    ApprovePurchaseRequestView,
    RejectPurchaseRequestView,
    GenerateRFQFromPRView,
    CreatePOFromQuotationView,
    UpdatePOStatusView
)

router = DefaultRouter()
router.register(r'purchase-requests', PurchaseRequestViewSet, basename='purchase-request')
router.register(r'rfqs', RFQViewSet, basename='rfq')
router.register(r'purchase-orders', PurchaseOrderViewSet, basename='purchase-order')

urlpatterns = [
    path('purchase-requests/<uuid:pk>/approve/', ApprovePurchaseRequestView.as_view(), name='pr_approve'),
    path('purchase-requests/<uuid:pk>/reject/', RejectPurchaseRequestView.as_view(), name='pr_reject'),
    path('purchase-requests/<uuid:pk>/generate-rfq/', GenerateRFQFromPRView.as_view(), name='pr_generate_rfq'),
    path('purchase-orders/create-from-quotation/', CreatePOFromQuotationView.as_view(), name='po_create_from_quotation'),
    path('purchase-orders/<uuid:pk>/update-status/', UpdatePOStatusView.as_view(), name='po_update_status'),
    path('', include(router.urls)),
]
