from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .services.quote_comparison import compare_quotes_with_gemini
from .services.contract_analysis import audit_contract_with_gemini
from .services.procurement_chat import process_copilot_chat_with_gemini
from .services.vendor_recommendation import recommend_vendors_with_gemini

class AIQuoteCompareView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, rfq_id):
        result = compare_quotes_with_gemini(rfq_id)
        return Response(result, status=status.HTTP_200_OK)

class AIContractAuditView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        title = request.data.get('title', 'Un-named Contract Document')
        vendor_id = request.data.get('vendor_id', None)
        result = audit_contract_with_gemini(title, vendor_id)
        return Response(result, status=status.HTTP_200_OK)

class AICopilotChatView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        user_query = request.data.get('query', '')
        if not user_query:
            return Response({'error': 'Query string is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        result = process_copilot_chat_with_gemini(user_query, user=request.user)
        return Response(result, status=status.HTTP_200_OK)

class AIVendorRecommendView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        rfq_id = request.data.get('rfq_id')
        if not rfq_id:
            return Response({'error': 'rfq_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        result = recommend_vendors_with_gemini(rfq_id)
        return Response(result, status=status.HTTP_200_OK)


class AISpendForecastingView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        from apps.services.ai_recommendations import forecast_upcoming_category_spend
        result = forecast_upcoming_category_spend()
        return Response(result, status=status.HTTP_200_OK)

class AIDuplicateCheckView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def post(self, request):
        title = request.data.get('title', '')
        category_id = request.data.get('category_id', None)
        from apps.services.purchase_service import detect_duplicate_purchase_requests
        duplicates = detect_duplicate_purchase_requests(title, category_id)
        return Response({'duplicates_found': len(duplicates) > 0, 'matches': duplicates}, status=status.HTTP_200_OK)

class AIPolicyValidateView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, rfq_id):
        from apps.procurement.models import RFQ
        from apps.services.ai_recommendations import validate_procurement_policy
        try:
            rfq = RFQ.objects.get(id=rfq_id)
            res = validate_procurement_policy(rfq)
            return Response(res, status=status.HTTP_200_OK)
        except RFQ.DoesNotExist:
            return Response({'error': 'RFQ not found'}, status=status.HTTP_404_NOT_FOUND)

class AIContractRenewalsView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        from apps.services.contract_service import get_expiring_contracts
        contracts = get_expiring_contracts()
        return Response({'expiring_contracts': contracts}, status=status.HTTP_200_OK)

