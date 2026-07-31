from rest_framework import serializers
from .models import Quotation
from apps.vendors.serializers import VendorSerializer

class QuotationSerializer(serializers.ModelSerializer):
    vendor_details = VendorSerializer(source='vendor', read_only=True)

    class Meta:
        model = Quotation
        fields = '__all__'
        read_only_fields = ('id', 'submitted_at')
