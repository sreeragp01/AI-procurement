import uuid
from django.db import models
from apps.procurement.models import RFQ
from apps.vendors.models import Vendor

class Quotation(models.Model):
    class OCRStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Extraction'
        PROCESSING = 'PROCESSING', 'Processing OCR/AI'
        COMPLETED = 'COMPLETED', 'Extraction Complete'
        FAILED = 'FAILED', 'Extraction Failed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rfq = models.ForeignKey(RFQ, on_delete=models.CASCADE, related_name='quotations')
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='quotations')
    
    document = models.FileField(upload_to='quotations/%Y/%m/', null=True, blank=True)
    total_quoted_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=10, default='INR')
    delivery_lead_time_days = models.IntegerField(default=7, help_text="Delivery timeframe in days")
    warranty_months = models.IntegerField(default=12, help_text="Warranty period in months")
    payment_terms = models.CharField(max_length=255, default="30% Advance, 70% Delivery")
    
    extracted_data = models.JSONField(default=dict, blank=True, help_text="Parsed line items, unit costs, tax rates")
    ocr_status = models.CharField(max_length=30, choices=OCRStatus.choices, default=OCRStatus.COMPLETED)
    
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Quote from {self.vendor.company_name} for {self.rfq.rfq_number}"
