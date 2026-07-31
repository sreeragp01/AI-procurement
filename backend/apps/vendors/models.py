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
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=30)
    tax_id = models.CharField(max_length=50, help_text="GST / VAT / Tax ID", blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, default='Mumbai')
    country = models.CharField(max_length=100, default='India')
    
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.5)
    categories = models.ManyToManyField(Category, related_name='vendors')
    
    # AI generated vendor metrics
    ai_performance_score = models.JSONField(default=dict, blank=True, help_text="Stores AI vendor scoring breakdown: { quality_score, on_time_delivery_rate, price_competitiveness, risk_level }")
    is_verified = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.company_name} ({self.rating}★)"
