from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Quotation
from .serializers import QuotationSerializer
from .services import parse_quotation_pdf_ai

class QuotationViewSet(viewsets.ModelViewSet):
    queryset = Quotation.objects.all().order_by('-submitted_at')
    serializer_class = QuotationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = super().get_queryset()
        rfq_id = self.request.query_params.get('rfq')
        if rfq_id:
            queryset = queryset.filter(rfq_id=rfq_id)
        return queryset

class QuotationUploadView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        rfq_id = request.data.get('rfq')
        vendor_id = request.data.get('vendor')
        document = request.FILES.get('document')

        if not rfq_id or not vendor_id:
            return Response({'error': 'rfq and vendor IDs are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Create or update quotation record
        quotation, created = Quotation.objects.get_or_create(
            rfq_id=rfq_id,
            vendor_id=vendor_id,
            defaults={
                'total_quoted_amount': request.data.get('total_quoted_amount', 3700000.00),
                'delivery_lead_time_days': request.data.get('delivery_lead_time_days', 4),
                'warranty_months': request.data.get('warranty_months', 24),
                'payment_terms': request.data.get('payment_terms', '30% Advance, 70% Net 30'),
            }
        )

        if document:
            quotation.document = document
            quotation.save()

        # Trigger AI OCR & Parsing pipeline
        res = parse_quotation_pdf_ai(quotation.id)

        serializer = QuotationSerializer(quotation)
        return Response({
            'message': 'Quotation uploaded and parsed with AI successfully',
            'quotation': serializer.data,
            'ai_extraction': res
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
