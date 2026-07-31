import uuid
from django.db import models
from apps.vendors.models import Vendor

class Contract(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'DRAFT', 'Draft'
        ACTIVE = 'ACTIVE', 'Active'
        EXPIRED = 'EXPIRED', 'Expired'
        TERMINATED = 'TERMINATED', 'Terminated'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_name = models.CharField(max_length=255, default='Apex Global Procurement')
    contract_number = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=255)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='contracts')
    
    document = models.FileField(upload_to='contracts/%Y/', null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    value = models.DecimalField(max_digits=14, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    
    # AI Risk & Clause Analysis
    ai_analysis = models.JSONField(default=dict, blank=True, help_text="AI contract assessment")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.contract_number:
            count = Contract.objects.count() + 1
            self.contract_number = f"CNT-2026-{count:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.contract_number} — {self.title}"
