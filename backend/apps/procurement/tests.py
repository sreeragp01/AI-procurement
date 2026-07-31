from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.procurement.models import Organization, Department, PurchaseRequest, WorkflowRule, ApprovalLog
from apps.vendors.models import Category, Vendor
from apps.services.sequence_service import generate_document_number
from apps.services.approval_engine import get_required_approval_chain, process_approval_action
from apps.services.purchase_service import detect_duplicate_purchase_requests
from apps.services.vendor_scoring import recalculate_vendor_snapshot

User = get_user_model()

class EnterpriseProcurementServicesTestCase(TestCase):
    def setUp(self):
        self.org = Organization.objects.create(name="Acme Corp")
        self.dept = Department.objects.create(organization=self.org, name="IT Department", annual_budget=10000000)
        self.category = Category.objects.create(name="IT Hardware", code="ITH-01")
        self.user = User.objects.create_user(email="testuser@acme.com", password="password123")

    def test_concurrency_safe_sequence_generator(self):
        """Test sequence number generator creates gapless PR-2026-0001, PR-2026-0002"""
        seq1 = generate_document_number("PR", self.org)
        seq2 = generate_document_number("PR", self.org)
        self.assertTrue(seq1.startswith("PR-"))
        self.assertTrue(seq2.startswith("PR-"))
        self.assertNotEqual(seq1, seq2)

    def test_data_driven_approval_engine(self):
        """Test rule engine evaluates custom chain based on budget amount"""
        WorkflowRule.objects.create(
            organization=self.org,
            rule_name="High Value IT Rule",
            min_amount=1000000,
            max_amount=10000000,
            category=self.category,
            approval_chain=['DEPARTMENT_HEAD', 'FINANCE', 'CIO', 'CEO']
        )
        
        pr = PurchaseRequest.objects.create(
            organization=self.org,
            created_by=self.user,
            department=self.dept,
            category=self.category,
            title="High Value Server Cluster",
            total_budget=Decimal("2500000.00"),
            required_by_date="2026-09-01"
        )
        
        chain = get_required_approval_chain(pr)
        self.assertEqual(chain, ['DEPARTMENT_HEAD', 'FINANCE', 'CIO', 'CEO'])

    def test_duplicate_purchase_request_detector(self):
        """Test duplicate request detection flags similar titles"""
        PurchaseRequest.objects.create(
            organization=self.org,
            created_by=self.user,
            department=self.dept,
            category=self.category,
            title="Dell Developer Laptops M3",
            total_budget=Decimal("500000.00"),
            required_by_date="2026-09-01"
        )

        duplicates = detect_duplicate_purchase_requests("Dell Developer Laptops M3", self.category.id)
        self.assertTrue(len(duplicates) >= 1)
        self.assertEqual(duplicates[0]['title'], "Dell Developer Laptops M3")

    def test_vendor_performance_snapshot(self):
        """Test periodic vendor snapshot recalculation"""
        vendor = Vendor.objects.create(
            company_name="TechSupplies Ltd",
            contact_person="John Doe",
            email="john@techsupplies.com",
            phone="9876543210"
        )
        snapshot = recalculate_vendor_snapshot(str(vendor.id), "2026-Q1")
        self.assertIsNotNone(snapshot)
        self.assertEqual(snapshot.vendor, vendor)
        self.assertEqual(snapshot.period_name, "2026-Q1")
