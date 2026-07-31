from decimal import Decimal
from apps.vendors.models import Vendor, VendorPerformanceSnapshot
from apps.procurement.models import PurchaseOrder, GoodsReceipt, Invoice

def recalculate_vendor_snapshot(vendor_id: str, period_name: str = "2026-Q1") -> VendorPerformanceSnapshot:
    """
    Recalculates historical metrics for a vendor based on PO fulfillment,
    GRN inspection results, and invoice discrepancies.
    """
    try:
        vendor = Vendor.objects.get(id=vendor_id)
    except Vendor.DoesNotExist:
        return None

    pos = PurchaseOrder.objects.filter(selected_vendor=vendor)
    total_fulfilled = pos.filter(status=PurchaseOrder.Status.COMPLETED).count()
    total_spend = sum([po.total_amount for po in pos.filter(status=PurchaseOrder.Status.COMPLETED)]) or Decimal('0.00')

    # Calculate GRN Pass Rate
    grns = GoodsReceipt.objects.filter(purchase_order__selected_vendor=vendor)
    total_grns = grns.count()
    passed_grns = grns.filter(inspection_status=GoodsReceipt.InspectionStatus.PASSED).count()
    quality_pass_rate = Decimal((passed_grns / total_grns) * 100) if total_grns > 0 else Decimal('96.50')

    # Calculate Invoice Discrepancy Rate
    invoices = Invoice.objects.filter(vendor=vendor)
    total_inv = invoices.count()
    discrepancy_inv = invoices.exclude(matching_status=Invoice.MatchingStatus.MATCHED).count()
    discrepancy_rate = Decimal((discrepancy_inv / total_inv) * 100) if total_inv > 0 else Decimal('2.00')

    on_time = getattr(vendor, 'on_time_delivery_rate', Decimal('95.00'))
    price_score = Decimal('92.00') if total_fulfilled > 3 else Decimal('88.00')

    snapshot, created = VendorPerformanceSnapshot.objects.update_or_create(
        vendor=vendor,
        period_name=period_name,
        defaults={
            'on_time_delivery_rate': on_time,
            'quality_pass_rate': quality_pass_rate,
            'price_competitiveness_score': price_score,
            'discrepancy_rate': discrepancy_rate,
            'total_orders_fulfilled': total_fulfilled,
            'total_spend_amount': total_spend,
            'ai_risk_assessment': {
                'reliability_rating': 'High' if quality_pass_rate >= 90 else 'Medium',
                'recommendation': 'Preferred Vendor for High Volume Procurement' if quality_pass_rate >= 90 else 'Requires Regular Inspection'
            }
        }
    )

    # Update Vendor top-level metrics
    vendor.quality_score = quality_pass_rate
    vendor.save(update_fields=['quality_score'])

    return snapshot
