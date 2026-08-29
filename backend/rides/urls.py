from django.urls import path
from . import views

urlpatterns = [
    # Real Auth
    path('auth/register/', views.register_user, name='register_user'),
    path('auth/login/', views.login_user, name='login_user'),
    path('auth/google/', views.google_auth, name='google_auth'),
    
    # Notifications Feed
    path('notifications/', views.get_user_notifications, name='get_user_notifications'),
    
    # Driver Document Verification & Advanced 8-Step Publishing
    path('driver/verify-docs/', views.verify_driver_docs, name='verify_driver_docs'),
    path('rides/publish-advanced/', views.publish_ride_advanced, name='publish_ride_advanced'),
    
    # Ride Search & Detail
    path('rides/search/', views.search_rides, name='search_rides'),
    path('rides/<str:ride_id>/', views.get_ride_detail, name='get_ride_detail'),
    
    # Real Device GPS Location Stream & Protected Live Tracking
    path('rides/<str:ride_id>/location/', views.update_device_location, name='update_device_location'),
    path('rides/<str:ride_id>/tracking/', views.get_ride_tracking, name='get_ride_tracking'),
    
    # Passenger Request & Driver Accept/Reject
    path('rides/<str:ride_id>/request/', views.request_ride, name='request_ride'),
    path('driver/requests/', views.get_driver_requests, name='get_driver_requests'),
    path('requests/<str:request_id>/action/', views.handle_request_action, name='handle_request_action'),
    
    # Separate Admin Website Backend APIs
    path('admin/login/', views.admin_login, name='admin_login'),
    path('admin/dashboard/', views.get_admin_dashboard, name='get_admin_dashboard'),
    path('admin/users/<str:user_id>/status/', views.update_user_status, name='update_user_status'),
    
    path('seed/', views.seed_database, name='seed_database'),
]
