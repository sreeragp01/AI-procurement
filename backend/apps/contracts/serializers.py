from rest_framework import serializers
from .models import Contract
from apps.vendors.serializers import VendorSerializer

class ContractSerializer(serializers.ModelSerializer):
    vendor_details = VendorSerializer(source='vendor', read_only=True)

    class Meta:
        model = Contract
        fields = '__all__'
        read_only_fields = ('id', 'contract_number', 'created_at', 'updated_at')
