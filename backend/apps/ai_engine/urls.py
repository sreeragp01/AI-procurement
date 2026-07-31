from django.urls import path
from .views import AIQuoteCompareView, AIContractAuditView, AICopilotChatView

urlpatterns = [
    path('quote-compare/<uuid:rfq_id>/', AIQuoteCompareView.as_view(), name='ai_quote_compare'),
    path('contract-audit/', AIContractAuditView.as_view(), name='ai_contract_audit'),
    path('chat/', AICopilotChatView.as_view(), name='ai_copilot_chat'),
]
