from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_overview, name='api_overview'),
    path('test/', views.test_endpoint, name='test_endpoint'),

    # Authentication endpoints
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login_user, name='login'),
    path('auth/users/', views.get_all_users, name='get_all_users'),
    path('auth/change-role/', views.change_user_role, name='change_user_role'),
    path('auth/toggle-status/', views.toggle_user_status, name='toggle_user_status'),
]