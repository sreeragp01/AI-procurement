from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, VendorViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'list', VendorViewSet, basename='vendor')

urlpatterns = [
    path('', include(router.urls)),
]
