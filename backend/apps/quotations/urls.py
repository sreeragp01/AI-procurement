from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuotationViewSet, QuotationUploadView

router = DefaultRouter()
router.register(r'list', QuotationViewSet, basename='quotation')

urlpatterns = [
    path('upload/', QuotationUploadView.as_view(), name='quotation_upload'),
    path('', include(router.urls)),
]
