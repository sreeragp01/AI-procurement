from rest_framework import serializers
from .models import (
    Organization, Department, PurchaseRequest, PurchaseRequestItem,
    WorkflowRule, ApprovalRule, ApprovalLog, Notification, RFQ,
    VendorInvitation, PurchaseOrder, GoodsReceipt, Invoice, Payment
)
from apps.vendors.serializers import CategorySerializer, VendorSerializer

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    organization_name = serializers.ReadOnlyField(source='organization.name')

    class Meta:
        model = Department
        fields = '__all__'

class PurchaseRequestItemSerializer(serializers.ModelSerializer):
    total_item_price = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseRequestItem
        fields = '__all__'

    def get_total_item_price(self, obj):
        return float(obj.quantity * obj.target_unit_price)

class WorkflowRuleSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = WorkflowRule
        fields = '__all__'

class ApprovalRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalRule
        fields = '__all__'

class ApprovalLogSerializer(serializers.ModelSerializer):
    approver_email = serializers.ReadOnlyField(source='approver.email')
    approver_name = serializers.SerializerMethodField()

    class Meta:
        model = ApprovalLog
        fields = '__all__'

    def get_approver_name(self, obj):
        return f"{obj.approver.first_name} {obj.approver.last_name}".strip() or obj.approver.email

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class PurchaseRequestSerializer(serializers.ModelSerializer):
    category_details = CategorySerializer(source='category', read_only=True)
    created_by_email = serializers.ReadOnlyField(source='created_by.email')
    department_name = serializers.ReadOnlyField(source='department.name')
    line_items = PurchaseRequestItemSerializer(many=True, read_only=True)
    approval_history = ApprovalLogSerializer(source='approval_logs', many=True, read_only=True)

    class Meta:
        model = PurchaseRequest
        fields = '__all__'
        read_only_fields = ('id', 'request_number', 'created_at', 'updated_at')

class VendorInvitationSerializer(serializers.ModelSerializer):
    vendor_details = VendorSerializer(source='vendor', read_only=True)

    class Meta:
        model = VendorInvitation
        fields = '__all__'

class RFQSerializer(serializers.ModelSerializer):
    purchase_request_details = PurchaseRequestSerializer(source='purchase_request', read_only=True)
    invitations = VendorInvitationSerializer(source='vendorinvitation_set', many=True, read_only=True)

    class Meta:
        model = RFQ
        fields = '__all__'
        read_only_fields = ('id', 'rfq_number', 'created_at', 'updated_at')

class PurchaseOrderSerializer(serializers.ModelSerializer):
    rfq_details = RFQSerializer(source='rfq', read_only=True)
    vendor_details = VendorSerializer(source='selected_vendor', read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = '__all__'
        read_only_fields = ('id', 'po_number', 'created_at', 'updated_at')

class GoodsReceiptSerializer(serializers.ModelSerializer):
    po_number = serializers.ReadOnlyField(source='purchase_order.po_number')
    received_by_name = serializers.ReadOnlyField(source='received_by.email')

    class Meta:
        model = GoodsReceipt
        fields = '__all__'
        read_only_fields = ('id', 'grn_number', 'created_at')

class InvoiceSerializer(serializers.ModelSerializer):
    po_number = serializers.ReadOnlyField(source='purchase_order.po_number')
    vendor_name = serializers.ReadOnlyField(source='vendor.company_name')

    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ('id', 'invoice_number', 'created_at')

class PaymentSerializer(serializers.ModelSerializer):
    invoice_number = serializers.ReadOnlyField(source='invoice.invoice_number')

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ('id', 'payment_number', 'payment_date')
