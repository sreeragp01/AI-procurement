from rest_framework import serializers
from .models import Quotation, QuotationItem
from apps.vendors.serializers import VendorSerializer

class QuotationItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationItem
        fields = '__all__'

class QuotationSerializer(serializers.ModelSerializer):
    vendor_details = VendorSerializer(source='vendor', read_only=True)
    line_items = QuotationItemSerializer(many=True, read_only=True)

    class Meta:
        model = Quotation
        fields = '__all__'
        read_only_fields = ('id', 'created_at')
