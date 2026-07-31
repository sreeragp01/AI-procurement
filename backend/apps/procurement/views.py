from datetime import timedelta
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import (
    Organization, Department, PurchaseRequest, PurchaseRequestItem,
    WorkflowRule, ApprovalRule, ApprovalLog, Notification, RFQ,
    VendorInvitation, PurchaseOrder, GoodsReceipt, Invoice, Payment
)
from .serializers import (
    OrganizationSerializer, DepartmentSerializer, PurchaseRequestSerializer,
    PurchaseRequestItemSerializer, WorkflowRuleSerializer, ApprovalRuleSerializer,
    ApprovalLogSerializer, NotificationSerializer, RFQSerializer,
    VendorInvitationSerializer, PurchaseOrderSerializer, GoodsReceiptSerializer,
    InvoiceSerializer, PaymentSerializer
)
from apps.vendors.models import Vendor, Category

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class WorkflowRuleViewSet(viewsets.ModelViewSet):
    queryset = WorkflowRule.objects.filter(is_active=True)
    serializer_class = WorkflowRuleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all().order_by('-created_at')
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'], url_path='mark-read')
    def mark_read(self, request, pk=None):
        notif = self.get_object()
        notif.is_read = True
        notif.save()
        return Response({'status': 'read'})

class PurchaseRequestViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequest.objects.all().order_by('-created_at')
    serializer_class = PurchaseRequestSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'], url_path='approve')
    def approve(self, request, pk=None):
        pr = self.get_object()
        user = request.user
        comments = request.data.get('comments', 'Approved by Manager')

        # IF-AND-THEN Workflow Chain Evaluation
        if float(pr.total_budget) > 1000000.00 and pr.status == PurchaseRequest.Status.PENDING_MANAGER:
            pr.status = PurchaseRequest.Status.PENDING_FINANCE
            msg = f"Purchase Request {pr.request_number} passed Manager review, pending Finance Director approval."
        else:
            pr.status = PurchaseRequest.Status.APPROVED
            msg = f"Purchase Request {pr.request_number} approved successfully."
        
        pr.save()

        if user and user.is_authenticated:
            ApprovalLog.objects.create(
                purchase_request=pr,
                approver=user,
                action=ApprovalLog.Action.APPROVED,
                comments=comments
            )

        return Response({'message': msg, 'status': pr.status})

    @action(detail=True, methods=['post'], url_path='reject')
    def reject(self, request, pk=None):
        pr = self.get_object()
        user = request.user
        comments = request.data.get('comments', 'Rejected by Approver')

        pr.status = PurchaseRequest.Status.REJECTED
        pr.save()

        if user and user.is_authenticated:
            ApprovalLog.objects.create(
                purchase_request=pr,
                approver=user,
                action=ApprovalLog.Action.REJECTED,
                comments=comments
            )

        return Response({'message': f'Purchase Request {pr.request_number} rejected.', 'status': pr.status})

    @action(detail=True, methods=['post'], url_path='generate-rfq')
    def generate_rfq(self, request, pk=None):
        pr = self.get_object()
        if pr.status != PurchaseRequest.Status.APPROVED:
            return Response({'error': 'Purchase Request must be APPROVED before generating an RFQ'}, status=status.HTTP_400_BAD_REQUEST)

        deadline = timezone.now() + timedelta(days=7)
        rfq = RFQ.objects.create(
            purchase_request=pr,
            submission_deadline=deadline,
            terms_and_conditions="Standard 30-day payment terms, GST included, minimum 12-month warranty."
        )

        matching_vendors = Vendor.objects.filter(categories=pr.category, status=Vendor.Status.ACTIVE)
        for vendor in matching_vendors:
            VendorInvitation.objects.create(rfq=rfq, vendor=vendor, status=VendorInvitation.Status.INVITED)

        pr.status = PurchaseRequest.Status.RFQ_CREATED
        pr.save()

        rfq_serializer = RFQSerializer(rfq)
        return Response({
            'message': f'RFQ {rfq.rfq_number} generated and sent to {matching_vendors.count()} category vendors.',
            'rfq': rfq_serializer.data
        }, status=status.HTTP_201_CREATED)

class PurchaseRequestItemViewSet(viewsets.ModelViewSet):
    queryset = PurchaseRequestItem.objects.all()
    serializer_class = PurchaseRequestItemSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ApprovalRuleViewSet(viewsets.ModelViewSet):
    queryset = ApprovalRule.objects.all()
    serializer_class = ApprovalRuleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ApprovalLogViewSet(viewsets.ModelViewSet):
    queryset = ApprovalLog.objects.all().order_by('-timestamp')
    serializer_class = ApprovalLogSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class RFQViewSet(viewsets.ModelViewSet):
    queryset = RFQ.objects.all().order_by('-created_at')
    serializer_class = RFQSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class VendorInvitationViewSet(viewsets.ModelViewSet):
    queryset = VendorInvitation.objects.all().order_by('-invited_at')
    serializer_class = VendorInvitationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all().order_by('-created_at')
    serializer_class = PurchaseOrderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['post'], url_path='advance-status')
    def advance_status(self, request, pk=None):
        po = self.get_object()
        status_flow = {
            PurchaseOrder.Status.ISSUED: PurchaseOrder.Status.ACKNOWLEDGED,
            PurchaseOrder.Status.ACKNOWLEDGED: PurchaseOrder.Status.IN_TRANSIT,
            PurchaseOrder.Status.IN_TRANSIT: PurchaseOrder.Status.DELIVERED,
            PurchaseOrder.Status.DELIVERED: PurchaseOrder.Status.COMPLETED
        }
        
        if po.status in status_flow:
            po.status = status_flow[po.status]
            po.save()
            return Response({'message': f'PO status updated to {po.get_status_display()}', 'status': po.status})
        else:
            return Response({'message': f'PO is already in final state: {po.get_status_display()}'})

    @action(detail=False, methods=['post'], url_path='create-from-quotation')
    def create_from_quotation(self, request):
        rfq_id = request.data.get('rfq_id')
        vendor_id = request.data.get('vendor_id')
        total_amount = request.data.get('total_amount', 3600000.00)

        if not rfq_id or not vendor_id:
            return Response({'error': 'rfq_id and vendor_id required'}, status=status.HTTP_400_BAD_REQUEST)

        rfq = RFQ.objects.get(id=rfq_id)
        vendor = Vendor.objects.get(id=vendor_id)

        po = PurchaseOrder.objects.create(
            rfq=rfq,
            selected_vendor=vendor,
            total_amount=total_amount,
            delivery_date=timezone.now().date() + timedelta(days=5),
            status=PurchaseOrder.Status.ISSUED
        )

        rfq.status = RFQ.Status.AWARDED
        rfq.save()

        serializer = PurchaseOrderSerializer(po)
        return Response({'message': f'Awarded to {vendor.company_name} and generated PO {po.po_number}', 'po': serializer.data}, status=status.HTTP_201_CREATED)

class GoodsReceiptViewSet(viewsets.ModelViewSet):
    queryset = GoodsReceipt.objects.all().order_by('-received_date')
    serializer_class = GoodsReceiptSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all().order_by('-created_at')
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-payment_date')
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
