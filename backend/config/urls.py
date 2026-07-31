"""
Main URL Routing for AI Procurement Copilot Backend API.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/vendors/', include('apps.vendors.urls')),
    path('api/v1/procurement/', include('apps.procurement.urls')),
    path('api/v1/quotations/', include('apps.quotations.urls')),
    path('api/v1/contracts/', include('apps.contracts.urls')),
    path('api/v1/ai/', include('apps.ai_engine.urls')),
    path('api/v1/dashboard/', include('apps.dashboard.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
