import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from datetime import date, timedelta
from django.utils import timezone
from apps.accounts.models import User
from apps.vendors.models import Category, Vendor
from apps.procurement.models import (
    Organization, Department, PurchaseRequest, PurchaseRequestItem,
    ApprovalRule, ApprovalLog, WorkflowRule, Notification, RFQ, VendorInvitation, PurchaseOrder,
    GoodsReceipt, Invoice, Payment
)
from apps.quotations.models import Quotation, QuotationItem
from apps.contracts.models import Contract

def seed_enterprise_data():
    print("Seeding AI Procurement Copilot Enterprise v2.0 Data...")

    # 1. Organizations & Departments
    org_apex, _ = Organization.objects.get_or_create(name="Apex Global Procurement", defaults={"domain": "apexprocure.com"})
    org_biomed, _ = Organization.objects.get_or_create(name="BioMed Health Corp", defaults={"domain": "biomedhealth.org"})
    org_buildcon, _ = Organization.objects.get_or_create(name="BuildCon Infra Ltd", defaults={"domain": "buildconinfra.com"})

    dept_it, _ = Department.objects.get_or_create(name="IT & Engineering", organization=org_apex, defaults={"annual_budget": 25000000.00})
    dept_med, _ = Department.objects.get_or_create(name="Medical Equipment", organization=org_biomed, defaults={"annual_budget": 50000000.00})

    # 2. Users & RBAC
    admin_user, _ = User.objects.get_or_create(
        email='admin@apexprocure.com',
        defaults={
            'first_name': 'Sreerag',
            'last_name': 'Manager',
            'role': User.Role.ADMIN,
            'organization_name': 'Apex Global Procurement',
            'department_name': 'IT & Engineering',
            'approval_limit': 10000000.00,
            'is_staff': True,
            'is_superuser': True
        }
    )
    admin_user.set_password('admin123')
    admin_user.save()

    manager_user, _ = User.objects.get_or_create(
        email='manager@apexprocure.com',
        defaults={
            'first_name': 'Ananya',
            'last_name': 'Sharma',
            'role': User.Role.PROCUREMENT_MANAGER,
            'organization_name': 'Apex Global Procurement',
            'department_name': 'IT & Engineering',
            'approval_limit': 1000000.00
        }
    )
    manager_user.set_password('manager123')
    manager_user.save()

    finance_user, _ = User.objects.get_or_create(
        email='finance@apexprocure.com',
        defaults={
            'first_name': 'Rajesh',
            'last_name': 'Verma',
            'role': User.Role.FINANCE,
            'organization_name': 'Apex Global Procurement',
            'department_name': 'Finance & Accounting',
            'approval_limit': 5000000.00
        }
    )
    finance_user.set_password('finance123')
    finance_user.save()

    # 3. Product Categories
    cat_it, _ = Category.objects.get_or_create(name="IT Hardware & Laptops", defaults={"code": "CAT-IT", "description": "Laptops, servers, workstations"})
    cat_raw, _ = Category.objects.get_or_create(name="Industrial Raw Steel", defaults={"code": "CAT-STEEL", "description": "Structural steel and fasteners"})
    cat_med, _ = Category.objects.get_or_create(name="Medical & Lab Devices", defaults={"code": "CAT-MED", "description": "Diagnostic and hospital equipment"})

    # 4. Enterprise Vendors
    v_tech, _ = Vendor.objects.get_or_create(
        company_name="TechCorp Hardware Ltd",
        defaults={
            "contact_person": "Vikram Seth",
            "email": "sales@techcorp.com",
            "phone": "+91 98765 43210",
            "tax_id": "27AAACT1234F1Z5",
            "city": "Bengaluru",
            "country": "India",
            "rating": 4.85,
            "status": Vendor.Status.ACTIVE,
            "is_preferred": True,
            "on_time_delivery_rate": 98.20,
            "quality_score": 99.10,
            "risk_level": Vendor.RiskLevel.LOW,
            "certifications": ["ISO 9001", "SOC2 Type II"],
            "ai_performance_score": {"quality": 99, "timeliness": 98, "pricing_competitiveness": 95}
        }
    )
    v_tech.categories.add(cat_it)

    v_nexus, _ = Vendor.objects.get_or_create(
        company_name="Nexus Digital Solutions",
        defaults={
            "contact_person": "Meera Patel",
            "email": "bids@nexusdigital.com",
            "phone": "+91 98111 22334",
            "tax_id": "27BBBND5678G2Z1",
            "city": "Mumbai",
            "country": "India",
            "rating": 4.20,
            "status": Vendor.Status.ACTIVE,
            "is_preferred": False,
            "on_time_delivery_rate": 90.00,
            "quality_score": 92.50,
            "risk_level": Vendor.RiskLevel.MEDIUM,
            "certifications": ["ISO 9001"],
            "ai_performance_score": {"quality": 91, "timeliness": 89, "pricing_competitiveness": 88}
        }
    )
    v_nexus.categories.add(cat_it)

    v_steel, _ = Vendor.objects.get_or_create(
        company_name="Global Steel & Infra",
        defaults={
            "contact_person": "Rohan Gupta",
            "email": "orders@globalsteel.com",
            "phone": "+91 97222 33445",
            "tax_id": "27CCCGS9012H3Z8",
            "city": "Pune",
            "country": "India",
            "rating": 4.65,
            "status": Vendor.Status.ACTIVE,
            "is_preferred": True,
            "on_time_delivery_rate": 96.50,
            "quality_score": 97.00,
            "risk_level": Vendor.RiskLevel.LOW,
            "certifications": ["ISO 9001", "ISO 14001"],
            "ai_performance_score": {"quality": 97, "timeliness": 96, "pricing_competitiveness": 94}
        }
    )
    v_steel.categories.add(cat_raw)

    # 5. Approval Rules & IF-AND-THEN Workflow Engine Rules
    ApprovalRule.objects.get_or_create(name="Manager Threshold", min_amount=0, max_amount=500000, required_role="PROCUREMENT_MANAGER")
    ApprovalRule.objects.get_or_create(name="Finance Director Threshold", min_amount=500001, max_amount=10000000, required_role="FINANCE")

    WorkflowRule.objects.get_or_create(
        rule_name="IT Hardware > 1M Multi-Stage Chain",
        defaults={
            "organization": org_apex,
            "min_amount": 1000000.00,
            "max_amount": 10000000.00,
            "category": cat_it,
            "department": dept_it,
            "approval_chain": ["DEPARTMENT_HEAD", "FINANCE", "CIO"],
            "is_active": True
        }
    )

    # 5b. Notifications
    Notification.objects.get_or_create(
        title="Pending Approval: PR-2026-0001",
        defaults={
            "organization": org_apex,
            "user": admin_user,
            "message": "PR-2026-0001 (Developer Laptops) requires Manager approval for ₹3,600,000 budget.",
            "notification_type": Notification.Type.APPROVAL_REQUIRED,
            "is_read": False,
            "link": "/approvals"
        }
    )
    Notification.objects.get_or_create(
        title="Contract Renewal Warning",
        defaults={
            "organization": org_apex,
            "user": admin_user,
            "message": "SLA Master Steel Contract with Global Steel expires in 35 days. Initiate renewal audit.",
            "notification_type": Notification.Type.CONTRACT_EXPIRING,
            "is_read": False,
            "link": "/contract-audit"
        }
    )

    # 6. Purchase Request with Line Items
    pr, created = PurchaseRequest.objects.get_or_create(
        request_number="PR-2026-0001",
        defaults={
            'created_by': admin_user,
            'department': dept_it,
            'category': cat_it,
            'title': "Developer Laptops & High-Perf Workstations",
            'total_budget': 3600000.00,
            'required_by_date': date.today() + timedelta(days=14),
            'priority': PurchaseRequest.Priority.HIGH,
            'status': PurchaseRequest.Status.APPROVED
        }
    )

    if created:
        PurchaseRequestItem.objects.create(
            purchase_request=pr,
            item_name="Apple MacBook Pro M3 Max (36GB RAM, 1TB SSD)",
            quantity=20.0,
            unit_of_measure="Units",
            target_unit_price=180000.00,
            specifications="Space Black, 16-inch Retina XDR display, AppleCare+ included"
        )
        ApprovalLog.objects.create(
            purchase_request=pr,
            approver=manager_user,
            action=ApprovalLog.Action.APPROVED,
            comments="Approved budget for Q3 Developer Hardware Refresh."
        )

    # 7. RFQ & Vendor Invitations
    rfq, _ = RFQ.objects.get_or_create(
        rfq_number="RFQ-2026-0001",
        defaults={
            'purchase_request': pr,
            'submission_deadline': timezone.now() + timedelta(days=7),
            'terms_and_conditions': "All bids must include 18% IGST, minimum 12-month warranty, and delivery to Mumbai Hub.",
            'status': RFQ.Status.EVALUATED
        }
    )

    VendorInvitation.objects.get_or_create(rfq=rfq, vendor=v_tech, defaults={"status": VendorInvitation.Status.RESPONDED})
    VendorInvitation.objects.get_or_create(rfq=rfq, vendor=v_nexus, defaults={"status": VendorInvitation.Status.RESPONDED})

    # 8. Quotations & Line Items
    q1, q1_created = Quotation.objects.get_or_create(
        rfq=rfq,
        vendor=v_tech,
        defaults={
            'total_price': 3600000.00,
            'currency': 'INR',
            'delivery_days': 5,
            'warranty_months': 24,
            'payment_terms': 'Net 30 Days',
            'ocr_status': Quotation.OCRStatus.SUCCESS
        }
    )
    if q1_created:
        QuotationItem.objects.create(
            quotation=q1,
            item_name="Apple MacBook Pro M3 Max (36GB, 1TB)",
            quantity=20.0,
            unit_price=152542.37,
            tax_rate=18.00,
            total_price=3600000.00
        )

    q2, q2_created = Quotation.objects.get_or_create(
        rfq=rfq,
        vendor=v_nexus,
        defaults={
            'total_price': 3850000.00,
            'currency': 'INR',
            'delivery_days': 3,
            'warranty_months': 12,
            'payment_terms': '100% Advance Payment',
            'ocr_status': Quotation.OCRStatus.SUCCESS
        }
    )

    # 9. Purchase Order
    po, _ = PurchaseOrder.objects.get_or_create(
        po_number="PO-2026-0001",
        defaults={
            'rfq': rfq,
            'selected_vendor': v_tech,
            'total_amount': 3600000.00,
            'delivery_date': date.today() + timedelta(days=5),
            'status': PurchaseOrder.Status.IN_TRANSIT
        }
    )

    # 10. Goods Receipt (GRN)
    grn, _ = GoodsReceipt.objects.get_or_create(
        grn_number="GRN-2026-0001",
        defaults={
            'purchase_order': po,
            'received_by': admin_user,
            'inspection_status': GoodsReceipt.InspectionStatus.PASSED,
            'received_items': [
                {"item_name": "Apple MacBook Pro M3 Max", "qty_ordered": 20, "qty_received": 20, "qty_accepted": 20, "notes": "All sealed boxes verified clean"}
            ]
        }
    )

    # 11. Invoice (3-Way Matching)
    inv, _ = Invoice.objects.get_or_create(
        invoice_number="INV-2026-0001",
        defaults={
            'purchase_order': po,
            'goods_receipt': grn,
            'vendor': v_tech,
            'invoice_amount': 3600000.00,
            'tax_amount': 549152.54,
            'matching_status': Invoice.MatchingStatus.MATCHED,
            'due_date': date.today() + timedelta(days=30)
        }
    )

    # 12. Payment
    Payment.objects.get_or_create(
        payment_number="PAY-2026-0001",
        defaults={
            'invoice': inv,
            'amount_paid': 3600000.00,
            'payment_method': Payment.Method.BANK_TRANSFER,
            'status': Payment.Status.COMPLETED,
            'transaction_reference': 'HDFC982301923011'
        }
    )

    # 13. Contract
    Contract.objects.get_or_create(
        contract_number="CNT-2026-0001",
        defaults={
            'vendor': v_steel,
            'title': "Annual Master Service Agreement & Steel Supply Contract",
            'value': 15000000.00,
            'start_date': date.today() - timedelta(days=330),
            'end_date': date.today() + timedelta(days=35),
            'status': Contract.Status.ACTIVE,
            'ai_analysis': {
                "overall_risk_score": 68,
                "missing_clauses": [
                    {"clause": "Liquidated Damages / Delay Penalty", "severity": "HIGH", "risk": "No delay penalty clause for late delivery."}
                ]
            }
        }
    )

    print("Enterprise v2.0 Database Seed Completed Successfully!")

if __name__ == '__main__':
    seed_enterprise_data()
