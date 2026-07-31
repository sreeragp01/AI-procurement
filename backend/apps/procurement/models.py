import uuid
from django.db import models
from django.conf import settings
from apps.vendors.models import Category, Vendor

class Organization(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Department(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='departments', null=True, blank=True)
    name = models.CharField(max_length=100)
    annual_budget = models.DecimalField(max_digits=14, decimal_places=2, default=10000000.00)

    def __str__(self):
        return f"{self.name} ({self.organization.name if self.organization else 'General'})"

class DocumentSequence(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='sequences', null=True, blank=True)
    prefix = models.CharField(max_length=20)
    year = models.IntegerField(default=2026)
    last_number = models.IntegerField(default=0)

    class Meta:
        unique_together = ('prefix', 'year', 'organization')

    def __str__(self):
        return f"Seq {self.prefix}-{self.year}: {self.last_number}"

class PurchaseRequest(models.Model):
    class Priority(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'
        URGENT = 'URGENT', 'Urgent'

    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PENDING_MANAGER = 'PENDING_MANAGER', 'Pending Manager Approval'
        PENDING_FINANCE = 'PENDING_FINANCE', 'Pending Finance Approval'
        PENDING_CIO = 'PENDING_CIO', 'Pending CIO Approval'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        RFQ_CREATED = 'RFQ_CREATED', 'RFQ Created'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='purchase_requests', null=True, blank=True)
    request_number = models.CharField(max_length=50, unique=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='purchase_requests')
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='purchase_requests')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='purchase_requests')
    
    title = models.CharField(max_length=255)
    total_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    required_by_date = models.DateField()
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING_MANAGER)
    
    items_legacy = models.JSONField(default=list, blank=True, help_text="Legacy JSON item list")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.request_number:
            from apps.services.sequence_service import generate_document_number
            self.request_number = generate_document_number('PR', self.organization)
        super().save(*args, **kwargs)

    def recalculate_total_budget(self):
        total = sum([item.quantity * item.target_unit_price for item in self.line_items.all()])
        if total > 0:
            self.total_budget = total
            self.save(update_fields=['total_budget'])

    def __str__(self):
        return f"{self.request_number} — {self.title}"

class PurchaseRequestItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    purchase_request = models.ForeignKey(PurchaseRequest, on_delete=models.CASCADE, related_name='line_items')
    item_name = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1.00)
    unit_of_measure = models.CharField(max_length=30, default='Units')
    target_unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    specifications = models.TextField(blank=True)

    def __str__(self):
        return f"{self.item_name} (x{self.quantity} {self.unit_of_measure}) for {self.purchase_request.request_number}"

class WorkflowRule(models.Model):
    """
    Configurable IF-AND-THEN Workflow Rule Engine Model
    Example: IF Amount > 1,000,000 AND Category = IT -> Require Chain ["DEPARTMENT_HEAD", "FINANCE", "CIO"]
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='workflow_rules', null=True, blank=True)
    rule_name = models.CharField(max_length=150)
    min_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    max_amount = models.DecimalField(max_digits=12, decimal_places=2, default=10000000.00)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    approval_chain = models.JSONField(default=list, help_text="Ordered list of required roles e.g. ['DEPARTMENT_HEAD', 'FINANCE', 'CIO']")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Workflow: {self.rule_name} (₹{self.min_amount:,.0f} - ₹{self.max_amount:,.0f})"

class ApprovalRule(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    min_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    max_amount = models.DecimalField(max_digits=12, decimal_places=2, default=500000.00)
    required_role = models.CharField(max_length=50, default='PROCUREMENT_MANAGER')

    def __str__(self):
        return f"Rule {self.name}: ₹{self.min_amount:,.0f} - ₹{self.max_amount:,.0f} ({self.required_role})"

class ApprovalLog(models.Model):
    class Action(models.TextChoices):
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        DELEGATED = 'DELEGATED', 'Delegated'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    purchase_request = models.ForeignKey(PurchaseRequest, on_delete=models.CASCADE, related_name='approval_logs')
    approver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    action = models.CharField(max_length=20, choices=Action.choices)
    comments = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.approver.email} {self.action} {self.purchase_request.request_number}"

class Notification(models.Model):
    """
    In-App Notification Center Model
    """
    class Type(models.TextChoices):
        APPROVAL_REQUIRED = 'APPROVAL_REQUIRED', 'Approval Required'
        RFQ_BID_DISPATCHED = 'RFQ_BID_DISPATCHED', 'RFQ Bid Dispatched'
        GRN_INSPECTION = 'GRN_INSPECTION', 'GRN Inspection'
        CONTRACT_EXPIRING = 'CONTRACT_EXPIRING', 'Contract Expiring Soon'
        PRICE_ANOMALY = 'PRICE_ANOMALY', 'Price Anomaly Alert'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications', null=True, blank=True)
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=30, choices=Type.choices, default=Type.APPROVAL_REQUIRED)
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=255, default='/')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Alert: {self.title} ({'READ' if self.is_read else 'UNREAD'})"

class RFQ(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published / Open'
        EVALUATED = 'EVALUATED', 'AI Evaluated'
        AWARDED = 'AWARDED', 'Awarded'
        CLOSED = 'CLOSED', 'Closed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='rfqs', null=True, blank=True)
    rfq_number = models.CharField(max_length=50, unique=True)
    purchase_request = models.ForeignKey(PurchaseRequest, on_delete=models.CASCADE, related_name='rfqs')
    invited_vendors = models.ManyToManyField(Vendor, through='VendorInvitation', related_name='rfqs_invited')
    
    submission_deadline = models.DateTimeField()
    terms_and_conditions = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PUBLISHED)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.rfq_number:
            from apps.services.sequence_service import generate_document_number
            self.rfq_number = generate_document_number('RFQ', self.organization)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.rfq_number} for {self.purchase_request.request_number}"

class VendorInvitation(models.Model):
    class Status(models.TextChoices):
        INVITED = 'INVITED', 'Invited'
        VIEWED = 'VIEWED', 'Viewed RFQ'
        RESPONDED = 'RESPONDED', 'Quotation Submitted'
        DECLINED = 'DECLINED', 'Declined Bid'
        EXPIRED = 'EXPIRED', 'Expired'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rfq = models.ForeignKey(RFQ, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.INVITED)
    invited_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('rfq', 'vendor')

    def __str__(self):
        return f"Invite to {self.vendor.company_name} for {self.rfq.rfq_number} ({self.get_status_display()})"

class PurchaseOrder(models.Model):
    class Status(models.TextChoices):
        ISSUED = 'ISSUED', 'Issued to Vendor'
        ACKNOWLEDGED = 'ACKNOWLEDGED', 'Vendor Acknowledged'
        IN_TRANSIT = 'IN_TRANSIT', 'In Transit / Shipped'
        DELIVERED = 'DELIVERED', 'Delivered & Inspected'
        COMPLETED = 'COMPLETED', 'Completed & Paid'
        CANCELLED = 'CANCELLED', 'Cancelled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='purchase_orders', null=True, blank=True)
    po_number = models.CharField(max_length=50, unique=True)
    rfq = models.ForeignKey(RFQ, on_delete=models.CASCADE, related_name='purchase_orders')
    selected_vendor = models.ForeignKey(Vendor, on_delete=models.PROTECT, related_name='purchase_orders')
    
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    delivery_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.ISSUED)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.po_number:
            from apps.services.sequence_service import generate_document_number
            self.po_number = generate_document_number('PO', self.organization)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.po_number} -> {self.selected_vendor.company_name}"

class GoodsReceipt(models.Model):
    class InspectionStatus(models.TextChoices):
        PASSED = 'PASSED', 'Passed Quality Inspection'
        PARTIAL_REJECT = 'PARTIAL_REJECT', 'Partial Rejection'
        FAILED = 'FAILED', 'Failed Inspection'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    grn_number = models.CharField(max_length=50, unique=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='goods_receipts')
    received_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    received_date = models.DateField(auto_now_add=True)
    inspection_status = models.CharField(max_length=20, choices=InspectionStatus.choices, default=InspectionStatus.PASSED)
    received_items = models.JSONField(default=list, help_text="List of inspected line items")
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.grn_number:
            from apps.services.sequence_service import generate_document_number
            self.grn_number = generate_document_number('GRN', getattr(self.purchase_order, 'organization', None))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.grn_number} for {self.purchase_order.po_number}"

class Invoice(models.Model):
    class MatchingStatus(models.TextChoices):
        MATCHED = 'MATCHED', '3-Way Matched (PO + GRN + Invoice)'
        DISCREPANCY_PRICE = 'DISCREPANCY_PRICE', 'Price Discrepancy Flagged'
        DISCREPANCY_QTY = 'DISCREPANCY_QTY', 'Quantity Discrepancy Flagged'
        UNMATCHED = 'UNMATCHED', 'Pending Inspection Matching'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice_number = models.CharField(max_length=50, unique=True)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='invoices')
    goods_receipt = models.ForeignKey(GoodsReceipt, on_delete=models.SET_NULL, null=True, blank=True, related_name='invoices')
    vendor = models.ForeignKey(Vendor, on_delete=models.PROTECT, related_name='invoices')
    
    invoice_amount = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    matching_status = models.CharField(max_length=30, choices=MatchingStatus.choices, default=MatchingStatus.MATCHED)
    due_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            from apps.services.sequence_service import generate_document_number
            self.invoice_number = generate_document_number('INV', getattr(self.purchase_order, 'organization', None))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.invoice_number} from {self.vendor.company_name} (₹{self.invoice_amount:,.2f})"

class Payment(models.Model):
    class Method(models.TextChoices):
        BANK_TRANSFER = 'BANK_TRANSFER', 'NEFT / RTGS Bank Transfer'
        ACH = 'ACH', 'ACH Direct Deposit'
        WIRE = 'WIRE', 'Wire Transfer'
        CHEQUE = 'CHEQUE', 'Cheque'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Payment'
        COMPLETED = 'COMPLETED', 'Payment Cleared'
        FAILED = 'FAILED', 'Failed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment_number = models.CharField(max_length=50, unique=True)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2)
    payment_date = models.DateField(auto_now_add=True)
    payment_method = models.CharField(max_length=30, choices=Method.choices, default=Method.BANK_TRANSFER)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.COMPLETED)
    transaction_reference = models.CharField(max_length=100, blank=True)

    def save(self, *args, **kwargs):
        if not self.payment_number:
            from apps.services.sequence_service import generate_document_number
            self.payment_number = generate_document_number('PAY', None)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.payment_number} — ₹{self.amount_paid:,.2f} ({self.status})"
