from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def health_check(request):
    return JsonResponse({
        "status": "online",
        "service": "RB Carpool Backend API",
        "endpoints": {
            "api_root": "/api/",
            "auth": "/api/auth/login/",
            "rides": "/api/rides/search/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('', health_check, name='health_check'),
    path('admin/', admin.site.urls),
    path('api/', include('rides.urls')),
]

