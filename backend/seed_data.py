import os
import sys
import django

# Setup Django Environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.vendors.models import Category, Vendor
from apps.procurement.models import PurchaseRequest, RFQ, PurchaseOrder
from apps.quotations.models import Quotation
from apps.contracts.models import Contract

User = get_user_model()

def seed():
    print("[*] Seeding database with initial AI Procurement Copilot demo data...")

    # 1. Admin User
    admin_user, created = User.objects.get_or_create(
        email="admin@apexprocure.com",
        defaults={
            "first_name": "Sreerag",
            "last_name": "Manager",
            "role": User.Role.ADMIN,
            "organization_name": "Apex Global Procurement",
            "is_staff": True,
            "is_superuser": True
        }
    )
    if created:
        admin_user.set_password("admin123")
        admin_user.save()
        print("  [+] Created Admin user: admin@apexprocure.com / admin123")

    # 2. Categories
    cat_it, _ = Category.objects.get_or_create(name="IT & Hardware", code="CAT-IT", description="Laptops, Servers, Monitors, Networking")
    cat_office, _ = Category.objects.get_or_create(name="Office & Stationery", code="CAT-OFF", description="Furniture, Paper, Office Supplies")
    cat_industrial, _ = Category.objects.get_or_create(name="Industrial Raw Materials", code="CAT-IND", description="Steel, Fasteners, Cables, Sheet Metals")

    print("  [+] Created product categories")

    # 3. Vendors
    v1, _ = Vendor.objects.get_or_create(
        email="sales@techcorp.com",
        defaults={
            "company_name": "TechCorp Hardware Ltd",
            "contact_person": "Vikram Malhotra",
            "phone": "+91 98765 43210",
            "tax_id": "GST27AAACT1234F1Z5",
            "address": "Bandra Kurla Complex, Mumbai",
            "city": "Mumbai",
            "country": "India",
            "rating": 4.85,
            "ai_performance_score": {"quality_score": 98, "on_time_delivery_rate": 96, "risk_level": "LOW"}
        }
    )
    v1.categories.add(cat_it)

    v2, _ = Vendor.objects.get_or_create(
        email="info@nexusdigital.com",
        defaults={
            "company_name": "Nexus Digital Solutions",
            "contact_person": "Ananya Sharma",
            "phone": "+91 98123 78901",
            "tax_id": "GST29BBBND5678G2Z4",
            "address": "Indiranagar, Bengaluru",
            "city": "Bengaluru",
            "country": "India",
            "rating": 4.60,
            "ai_performance_score": {"quality_score": 92, "on_time_delivery_rate": 90, "risk_level": "LOW"}
        }
    )
    v2.categories.add(cat_it)

    v3, _ = Vendor.objects.get_or_create(
        email="contact@globalsteel.com",
        defaults={
            "company_name": "Global Steel & Infra",
            "contact_person": "Rajesh Verma",
            "phone": "+91 97111 22334",
            "tax_id": "GST07CCCGS9101H3Z3",
            "address": "Okhla Industrial Area, New Delhi",
            "city": "New Delhi",
            "country": "India",
            "rating": 4.30,
            "ai_performance_score": {"quality_score": 88, "on_time_delivery_rate": 84, "risk_level": "MEDIUM"}
        }
    )
    v3.categories.add(cat_industrial)

    print("  [+] Created demo vendors: TechCorp, Nexus Digital, Global Steel")

    # 4. Purchase Request
    pr1, _ = PurchaseRequest.objects.get_or_create(
        request_number="PR-2026-0001",
        defaults={
            "created_by": admin_user,
            "category": cat_it,
            "title": "Procurement of 20 Developer Laptops (M3 / 32GB RAM)",
            "items": [
                {"item_name": "Developer Laptop (M3 Pro, 32GB, 1TB SSD)", "quantity": 20, "est_unit_price": 200000}
            ],
            "total_budget": 4000000.00,
            "required_by_date": "2026-08-20",
            "priority": PurchaseRequest.Priority.HIGH,
            "status": PurchaseRequest.Status.RFQ_CREATED
        }
    )

    print("  [+] Created sample Purchase Request PR-2026-0001")

    # 5. RFQ
    rfq1, _ = RFQ.objects.get_or_create(
        rfq_number="RFQ-2026-0001",
        defaults={
            "purchase_request": pr1,
            "submission_deadline": "2026-08-10T18:00:00Z",
            "terms_and_conditions": "1 Year Onsite Warranty required. Payment terms 30 days post delivery.",
            "status": RFQ.Status.EVALUATED
        }
    )
    rfq1.invited_vendors.add(v1, v2)

    print("  [+] Created sample RFQ-2026-0001")

    # 6. Quotations
    q1, _ = Quotation.objects.get_or_create(
        rfq=rfq1,
        vendor=v1,
        defaults={
            "total_quoted_amount": 3600000.00,
            "delivery_lead_time_days": 5,
            "warranty_months": 24,
            "payment_terms": "20% Advance, 80% Net 30 days after inspection",
            "extracted_data": {
                "unit_price": 180000,
                "tax_rate": "18% GST included",
                "discount": "10% Bulk Discount Applied"
            }
        }
    )

    q2, _ = Quotation.objects.get_or_create(
        rfq=rfq1,
        vendor=v2,
        defaults={
            "total_quoted_amount": 3850000.00,
            "delivery_lead_time_days": 3,
            "warranty_months": 12,
            "payment_terms": "100% Advance Payment on Order Confirmation",
            "extracted_data": {
                "unit_price": 192500,
                "tax_rate": "18% GST extra",
                "discount": "5% Express Shipping Discount"
            }
        }
    )

    print("  [+] Created Quotations for TechCorp & Nexus Digital")

    # 7. Sample Contract
    c1, _ = Contract.objects.get_or_create(
        contract_number="CNT-2026-0001",
        defaults={
            "title": "Annual Hardware Maintenance & SLA Contract",
            "vendor": v1,
            "start_date": "2026-01-01",
            "end_date": "2026-12-31",
            "value": 1500000.00,
            "status": Contract.Status.ACTIVE,
            "ai_analysis": {
                "overall_risk": "LOW",
                "missing_clauses": ["Liquidated damages capped at 5%"],
                "renewal_alert": "2026-11-30"
            }
        }
    )

    print("  [+] Created sample SLA Contract CNT-2026-0001")
    print("[SUCCESS] Database seeding complete!")

if __name__ == '__main__':
    seed()
