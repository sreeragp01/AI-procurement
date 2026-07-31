from django.urls import path
from .views import (
    AIQuoteCompareView,
    AIContractAuditView,
    AICopilotChatView,
    AIVendorRecommendView,
    AISpendForecastingView,
    AIDuplicateCheckView,
    AIPolicyValidateView,
    AIContractRenewalsView
)

urlpatterns = [
    path('quote-matrix/<uuid:rfq_id>/', AIQuoteCompareView.as_view(), name='ai-quote-matrix'),
    path('audit-contract-risk/', AIContractAuditView.as_view(), name='ai-contract-audit'),
    path('copilot-chat/', AICopilotChatView.as_view(), name='ai-copilot-chat'),
    path('recommend-vendors/', AIVendorRecommendView.as_view(), name='ai-recommend-vendors'),
    path('spend-forecasting/', AISpendForecastingView.as_view(), name='ai-spend-forecasting'),
    path('duplicate-check/', AIDuplicateCheckView.as_view(), name='ai-duplicate-check'),
    path('policy-validate/<uuid:rfq_id>/', AIPolicyValidateView.as_view(), name='ai-policy-validate'),
    path('contract-renewals/', AIContractRenewalsView.as_view(), name='ai-contract-renewals'),
]

