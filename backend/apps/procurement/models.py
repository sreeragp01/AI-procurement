import uuid
from django.db import models
from django.conf import settings
from apps.vendors.models import Category, Vendor

class PurchaseRequest(models.Model):
    class Priority(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'
        URGENT = 'URGENT', 'Urgent'

    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PENDING_APPROVAL = 'PENDING_APPROVAL', 'Pending Approval'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        RFQ_CREATED = 'RFQ_CREATED', 'RFQ Created'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_number = models.CharField(max_length=50, unique=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='purchase_requests')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='purchase_requests')
    
    title = models.CharField(max_length=255)
    items = models.JSONField(help_text="Structured item list: [{ item_name, quantity, spec, est_unit_price }]")
    total_budget = models.DecimalField(max_digits=12, decimal_places=2)
    required_by_date = models.DateField()
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING_APPROVAL)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.request_number:
            count = PurchaseRequest.objects.count() + 1
            self.request_number = f"PR-2026-{count:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.request_number} — {self.title}"

class RFQ(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        PUBLISHED = 'PUBLISHED', 'Published / Open'
        EVALUATED = 'EVALUATED', 'AI Evaluated'
        AWARDED = 'AWARDED', 'Awarded'
        CLOSED = 'CLOSED', 'Closed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rfq_number = models.CharField(max_length=50, unique=True)
    purchase_request = models.ForeignKey(PurchaseRequest, on_delete=models.CASCADE, related_name='rfqs')
    invited_vendors = models.ManyToManyField(Vendor, related_name='rfqs_invited')
    
    submission_deadline = models.DateTimeField()
    terms_and_conditions = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PUBLISHED)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.rfq_number:
            count = RFQ.objects.count() + 1
            self.rfq_number = f"RFQ-2026-{count:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.rfq_number} for {self.purchase_request.request_number}"

class PurchaseOrder(models.Model):
    class Status(models.TextChoices):
        ISSUED = 'ISSUED', 'Issued to Vendor'
        ACKNOWLEDGED = 'ACKNOWLEDGED', 'Vendor Acknowledged'
        IN_TRANSIT = 'IN_TRANSIT', 'In Transit / Shipped'
        DELIVERED = 'DELIVERED', 'Delivered & Inspected'
        COMPLETED = 'COMPLETED', 'Completed & Paid'
        CANCELLED = 'CANCELLED', 'Cancelled'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
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
            count = PurchaseOrder.objects.count() + 1
            self.po_number = f"PO-2026-{count:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.po_number} -> {self.selected_vendor.company_name}"
