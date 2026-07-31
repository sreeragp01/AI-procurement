from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContractViewSet, ContractAuditUploadView

router = DefaultRouter()
router.register(r'list', ContractViewSet, basename='contract')

urlpatterns = [
    path('upload-audit/', ContractAuditUploadView.as_view(), name='contract_upload_audit'),
    path('', include(router.urls)),
]
