from django.urls import path
from .views import DashboardMetricsView, ProcurementHealthScoreView

urlpatterns = [
    path('metrics/', DashboardMetricsView.as_view(), name='dashboard_metrics'),
    path('health-score/', ProcurementHealthScoreView.as_view(), name='dashboard_health_score'),
]

