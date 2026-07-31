from rest_framework import serializers
from .models import PurchaseRequest, RFQ, PurchaseOrder
from apps.vendors.serializers import CategorySerializer, VendorSerializer
from apps.accounts.serializers import UserSerializer

class PurchaseRequestSerializer(serializers.ModelSerializer):
    created_by_details = UserSerializer(source='created_by', read_only=True)
    category_details = CategorySerializer(source='category', read_only=True)

    class Meta:
        model = PurchaseRequest
        fields = '__all__'
        read_only_fields = ('id', 'request_number', 'created_by', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)

class RFQSerializer(serializers.ModelSerializer):
    purchase_request_details = PurchaseRequestSerializer(source='purchase_request', read_only=True)
    invited_vendors_details = VendorSerializer(source='invited_vendors', many=True, read_only=True)

    class Meta:
        model = RFQ
        fields = '__all__'
        read_only_fields = ('id', 'rfq_number', 'created_at', 'updated_at')

class PurchaseOrderSerializer(serializers.ModelSerializer):
    rfq_details = RFQSerializer(source='rfq', read_only=True)
    selected_vendor_details = VendorSerializer(source='selected_vendor', read_only=True)

    class Meta:
        model = PurchaseOrder
        fields = '__all__'
        read_only_fields = ('id', 'po_number', 'created_at', 'updated_at')
