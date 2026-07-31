from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .services import (
    generate_quote_comparison_matrix,
    audit_contract_risk,
    copilot_rag_query,
    recommend_vendors_for_rfq
)
from .forecasting import get_spend_forecasting_and_anomalies

class AIQuoteCompareView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, rfq_id):
        result = generate_quote_comparison_matrix(rfq_id)
        return Response(result, status=status.HTTP_200_OK)

class AIContractAuditView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        title = request.data.get('title', 'Un-named Contract Document')
        vendor_id = request.data.get('vendor_id', None)
        result = audit_contract_risk(title, vendor_id)
        return Response(result, status=status.HTTP_200_OK)

class AICopilotChatView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        user_query = request.data.get('query', '')
        if not user_query:
            return Response({'error': 'Query string is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        reply = copilot_rag_query(user_query)
        return Response({'query': user_query, 'reply': reply}, status=status.HTTP_200_OK)

class AIVendorRecommendView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        rfq_id = request.data.get('rfq_id')
        if not rfq_id:
            return Response({'error': 'rfq_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        result = recommend_vendors_for_rfq(rfq_id)
        return Response(result, status=status.HTTP_200_OK)

class AISpendForecastingView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        result = get_spend_forecasting_and_anomalies()
        return Response(result, status=status.HTTP_200_OK)
