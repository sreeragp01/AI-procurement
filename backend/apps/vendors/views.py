from rest_framework import viewsets, permissions, filters
from .models import Category, Vendor
from .serializers import CategorySerializer, VendorSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all().order_by('-rating', 'company_name')
    serializer_class = VendorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['company_name', 'contact_person', 'email', 'tax_id', 'city']
    ordering_fields = ['rating', 'company_name', 'created_at']
