from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Vendor, VendorPerformanceSnapshot
from .serializers import CategorySerializer, VendorSerializer, VendorPerformanceSnapshotSerializer
from apps.services.vendor_scoring import recalculate_vendor_snapshot

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

    @action(detail=True, methods=['post'], url_path='recalculate-performance')
    def recalculate_performance(self, request, pk=None):
        period = request.data.get('period_name', '2026-Q1')
        snapshot = recalculate_vendor_snapshot(pk, period)
        if snapshot:
            return Response(VendorPerformanceSnapshotSerializer(snapshot).data, status=status.HTTP_200_OK)
        return Response({'error': 'Vendor not found'}, status=status.HTTP_404_NOT_FOUND)

