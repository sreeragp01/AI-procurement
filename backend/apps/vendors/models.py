import uuid
from django.db import models

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=20, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Vendor(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active / Qualified'
        SUSPENDED = 'SUSPENDED', 'Suspended'
        BLACKLISTED = 'BLACKLISTED', 'Blacklisted'

    class RiskLevel(models.TextChoices):
        LOW = 'LOW', 'Low Risk'
        MEDIUM = 'MEDIUM', 'Medium Risk'
        HIGH = 'HIGH', 'High Risk'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization_name = models.CharField(max_length=255, default='Apex Global Procurement')
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30)
    tax_id = models.CharField(max_length=50, help_text="GST / VAT / Tax ID", blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, default='Mumbai')
    country = models.CharField(max_length=100, default='India')
    
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.5)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    is_preferred = models.BooleanField(default=False, help_text="Preferred supplier for fast-track RFQs")
    
    on_time_delivery_rate = models.DecimalField(max_digits=5, decimal_places=2, default=95.00, help_text="On-time delivery percentage")
    quality_score = models.DecimalField(max_digits=5, decimal_places=2, default=96.50, help_text="Inspected quality pass rate percentage")
    risk_level = models.CharField(max_length=20, choices=RiskLevel.choices, default=RiskLevel.LOW)
    certifications = models.JSONField(default=list, blank=True, help_text="List of certifications")
    bank_details_encrypted = models.JSONField(default=dict, blank=True)
    
    categories = models.ManyToManyField(Category, related_name='vendors')
    ai_performance_score = models.JSONField(default=dict, blank=True)
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name} ({self.get_status_display()} — {self.rating}★)"
