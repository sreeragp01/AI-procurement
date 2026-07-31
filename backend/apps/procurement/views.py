from rest_framework import viewsets, permissions, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import PurchaseRequest, RFQ, PurchaseOrder
from .serializers import PurchaseRequestSerializer, RFQSerializer, PurchaseOrderSerializer
from apps.vendors.models import Vendor
from apps.quotations.models import Quotation

class PurchaseRequestViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequest.objects.all().order_by('-created_at')
    serializer_class = PurchaseRequestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['request_number', 'title', 'priority', 'status']

class ApprovePurchaseRequestView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, pk):
        try:
            pr = PurchaseRequest.objects.get(pk=pk)
        except PurchaseRequest.DoesNotExist:
            return Response({'error': 'Purchase Request not found'}, status=status.HTTP_404_NOT_FOUND)

        pr.status = PurchaseRequest.Status.APPROVED
        pr.save()
        serializer = PurchaseRequestSerializer(pr)
        return Response({'message': f'{pr.request_number} approved successfully', 'purchase_request': serializer.data})

class RejectPurchaseRequestView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, pk):
        try:
            pr = PurchaseRequest.objects.get(pk=pk)
        except PurchaseRequest.DoesNotExist:
            return Response({'error': 'Purchase Request not found'}, status=status.HTTP_404_NOT_FOUND)

        pr.status = PurchaseRequest.Status.REJECTED
        pr.save()
        serializer = PurchaseRequestSerializer(pr)
        return Response({'message': f'{pr.request_number} rejected', 'purchase_request': serializer.data})

class GenerateRFQFromPRView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, pk):
        try:
            pr = PurchaseRequest.objects.get(pk=pk)
        except PurchaseRequest.DoesNotExist:
            return Response({'error': 'Purchase Request not found'}, status=status.HTTP_404_NOT_FOUND)

        # Auto select vendors matching the PR category
        matching_vendors = Vendor.objects.filter(categories=pr.category)
        if not matching_vendors.exists():
            matching_vendors = Vendor.objects.all()[:3]

        rfq = RFQ.objects.create(
            purchase_request=pr,
            submission_deadline=timezone.now() + timezone.timedelta(days=7),
            terms_and_conditions=f"Standard 1-year warranty required. Category: {pr.category.name}",
            status=RFQ.Status.PUBLISHED
        )
        rfq.invited_vendors.set(matching_vendors)
        rfq.save()

        pr.status = PurchaseRequest.Status.RFQ_CREATED
        pr.save()

        serializer = RFQSerializer(rfq)
        return Response({
            'message': f'RFQ {rfq.rfq_number} generated and dispatched to {matching_vendors.count()} vendors!',
            'rfq': serializer.data
        }, status=status.HTTP_201_CREATED)

class RFQViewSet(viewsets.ModelViewSet):
    queryset = RFQ.objects.all().order_by('-created_at')
    serializer_class = RFQSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['rfq_number', 'status']

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all().order_by('-created_at')
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['po_number', 'status']

class CreatePOFromQuotationView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        rfq_id = request.data.get('rfq_id')
        vendor_id = request.data.get('vendor_id')
        total_amount = request.data.get('total_amount', 3600000.00)

        if not rfq_id or not vendor_id:
            return Response({'error': 'rfq_id and vendor_id are required'}, status=status.HTTP_400_BAD_REQUEST)

        rfq = RFQ.objects.get(id=rfq_id)
        vendor = Vendor.objects.get(id=vendor_id)

        po = PurchaseOrder.objects.create(
            rfq=rfq,
            selected_vendor=vendor,
            total_amount=total_amount,
            delivery_date=timezone.now().date() + timezone.timedelta(days=7),
            status=PurchaseOrder.Status.ISSUED
        )

        rfq.status = RFQ.Status.AWARDED
        rfq.save()

        serializer = PurchaseOrderSerializer(po)
        return Response({
            'message': f'Purchase Order {po.po_number} issued to {vendor.company_name} successfully!',
            'purchase_order': serializer.data
        }, status=status.HTTP_201_CREATED)

class UpdatePOStatusView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request, pk):
        try:
            po = PurchaseOrder.objects.get(pk=pk)
        except PurchaseOrder.DoesNotExist:
            return Response({'error': 'Purchase Order not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status in dict(PurchaseOrder.Status.choices):
            po.status = new_status
            po.save()
            serializer = PurchaseOrderSerializer(po)
            return Response({'message': f'{po.po_number} status updated to {po.get_status_display()}', 'purchase_order': serializer.data})
        else:
            return Response({'error': 'Invalid PO status'}, status=status.HTTP_400_BAD_REQUEST)
