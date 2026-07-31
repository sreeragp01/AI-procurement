from rest_framework import serializers
from .models import Category, Vendor

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class VendorSerializer(serializers.ModelSerializer):
    categories_details = CategorySerializer(source='categories', many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), many=True, write_only=True, source='categories'
    )

    class Meta:
        model = Vendor
        fields = (
            'id', 'company_name', 'contact_person', 'email', 'phone', 'tax_id',
            'address', 'city', 'country', 'rating', 'status', 'is_preferred',
            'on_time_delivery_rate', 'quality_score', 'risk_level', 'certifications',
            'categories_details', 'category_ids', 'ai_performance_score', 'is_verified',
            'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
