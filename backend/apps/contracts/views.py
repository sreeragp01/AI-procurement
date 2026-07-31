from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Contract
from .serializers import ContractSerializer
from .services import audit_contract_pdf_ai

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all().order_by('-created_at')
    serializer_class = ContractSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class ContractAuditUploadView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        title = request.data.get('title', 'Master SLA & Hardware Contract')
        vendor_id = request.data.get('vendor')
        document = request.FILES.get('document')

        if not vendor_id:
            return Response({'error': 'vendor ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        contract = Contract.objects.create(
            title=title,
            vendor_id=vendor_id,
            start_date=request.data.get('start_date', '2026-08-01'),
            end_date=request.data.get('end_date', '2027-07-31'),
            value=request.data.get('value', 2500000.00),
            document=document
        )

        # Trigger AI Contract Audit
        audit_res = audit_contract_pdf_ai(contract.id)

        serializer = ContractSerializer(contract)
        return Response({
            'message': 'Contract uploaded and audited with AI successfully',
            'contract': serializer.data,
            'audit_results': audit_res
        }, status=status.HTTP_201_CREATED)
