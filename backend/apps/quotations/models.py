import uuid
from django.db import models
from django.utils import timezone
from apps.procurement.models import RFQ, PurchaseRequestItem
from apps.vendors.models import Vendor

class Quotation(models.Model):
    class OCRStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending AI Extraction'
        SUCCESS = 'SUCCESS', 'AI Extraction Complete'
        FAILED = 'FAILED', 'OCR Failed'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rfq = models.ForeignKey(RFQ, on_delete=models.CASCADE, related_name='quotations')
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='quotations')
    
    document = models.FileField(upload_to='quotations/', blank=True, null=True)
    raw_text = models.TextField(blank=True, help_text="Extracted text from PDF OCR")
    
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    currency = models.CharField(max_length=10, default='INR')
    delivery_days = models.IntegerField(default=5, help_text="Delivery lead time in calendar days")
    warranty_months = models.IntegerField(default=12)
    payment_terms = models.CharField(max_length=255, default="Net 30 Days")
    
    ocr_status = models.CharField(max_length=20, choices=OCRStatus.choices, default=OCRStatus.SUCCESS)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Quote from {self.vendor.company_name} for {self.rfq.rfq_number} — ₹{self.total_price:,.2f}"

class QuotationItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='line_items')
    request_item = models.ForeignKey(PurchaseRequestItem, on_delete=models.SET_NULL, null=True, blank=True, related_name='quotation_items')
    
    item_name = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1.00)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=18.00, help_text="GST / Tax rate percentage")
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        if not self.total_price or self.total_price == 0:
            subtotal = self.quantity * self.unit_price
            self.total_price = subtotal * (1 + (self.tax_rate / 100))
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.item_name} (x{self.quantity}) @ ₹{self.unit_price:,.2f} = ₹{self.total_price:,.2f}"
