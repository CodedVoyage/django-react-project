from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate, login as django_login
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json

@csrf_exempt
@require_http_methods(["GET", "POST", "OPTIONS"])
def cors_test(request):
    """
    Simple test endpoint to check CORS functionality
    """
    response_data = {
        'message': 'CORS test successful',
        'method': request.method,
        'headers': dict(request.headers)
    }
    
    response = JsonResponse(response_data)
    
    # Manually set CORS headers for testing
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    
    return response

@api_view(['GET'])
def api_overview(request):
    """
    Simple API endpoint for testing Django-React connection
    """
    data = {
        'message': 'Hello from Django API!',
        'status': 'success',
        'endpoints': [
            '/api/',
            '/api/test/',
            '/api/auth/register/',
            '/api/auth/login/',
            '/api/auth/users/',
            '/api/auth/change-role/',
            '/api/auth/toggle-status/',
        ]   
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def test_endpoint(request):
    """
    Test endpoint that echoes back data
    """
    if request.method == 'GET':
        return Response({
            'message': 'GET request successful',
            'method': 'GET'
        }, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        return Response({
            'message': 'POST request successful',
            'method': 'POST',
            'received_data': request.data
        }, status=status.HTTP_201_CREATED)


# Helper function to serialize user data
def serialize_user(user):
    """
    Serialize User model instance to dictionary
    """
    return {
        'id': str(user.id),
        'userid': user.username,
        'username': user.username,
        'email': user.email,
        'mobile': getattr(user, 'first_name', ''),  # Use first_name field to store mobile
        'role': 'admin' if user.is_superuser else ('moderator' if user.is_staff else 'user'),
        'createdAt': user.date_joined.isoformat(),
        'isActive': user.is_active,
    }

@api_view(['POST'])
def register(request):
    """
    Register a new user
    """
    try:
        data = request.data
        username = data.get('username')
        email = data.get('email')
        mobile = data.get('mobile', '')
        password = data.get('password')

        # Validate required fields
        if not all([username, email, password]):
            response = Response({
                'success': False,
                'message': 'Username, email, and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
            # Add manual CORS headers as workaround
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            response["Access-Control-Allow-Credentials"] = "true"
            
            return response

        # Check if username already exists
        if User.objects.filter(username=username).exists():
            response = Response({
                'success': False,
                'message': 'Username already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
            
            # Add manual CORS headers as workaround
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            response["Access-Control-Allow-Credentials"] = "true"
            
            return response

        # Check if email already exists
        if User.objects.filter(email=email).exists():
            response = Response({
                'success': False,
                'message': 'Email already exists'
            }, status=status.HTTP_400_BAD_REQUEST)
            
            # Add manual CORS headers as workaround
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            response["Access-Control-Allow-Credentials"] = "true"
            
            return response

        # Validate password
        try:
            validate_password(password)
        except ValidationError as e:
            response = Response({
                'success': False,
                'message': str(e.messages[0]) if e.messages else 'Password validation failed'
            }, status=status.HTTP_400_BAD_REQUEST)
            
            # Add manual CORS headers as workaround
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            response["Access-Control-Allow-Credentials"] = "true"
            
            return response

        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            is_active=True
        )

        # Store mobile in user's first_name field (would be better with custom User model)
        user.first_name = mobile
        user.save()

        response_data = {
            'success': True,
            'message': 'Registration successful! You can now login with your credentials.',
            'user': serialize_user(user)
        }

        response = Response(response_data, status=status.HTTP_201_CREATED)
        
        # Add manual CORS headers as workaround
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        
        return response

    except Exception as e:
        response = Response({
            'success': False,
            'message': f'Registration failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Add manual CORS headers as workaround
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        
        return response

@api_view(['POST'])
def login_user(request):
    """
    Authenticate user and return token
    """
    try:
        data = request.data
        userid = data.get('userid')
        password = data.get('password')

        if not all([userid, password]):
            response = Response({
                'success': False,
                'message': 'User ID and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
            
            # Add manual CORS headers as workaround
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            response["Access-Control-Allow-Credentials"] = "true"
            
            return response

        # Authenticate user
        user = authenticate(request, username=userid, password=password)

        if not user:
            response = Response({
                'success': False,
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Add manual CORS headers as workaround
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            response["Access-Control-Allow-Credentials"] = "true"
            
            return response

        if not user.is_active:
            response = Response({
                'success': False,
                'message': 'Account is deactivated. Please contact administrator.'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Add manual CORS headers as workaround
            response["Access-Control-Allow-Origin"] = "*"
            response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
            response["Access-Control-Allow-Credentials"] = "true"
            
            return response

        # Get or create token
        token, created = Token.objects.get_or_create(user=user)

        response_data = {
            'success': True,
            'message': 'Login successful',
            'token': token.key,
            'user': serialize_user(user)
        }

        response = Response(response_data, status=status.HTTP_200_OK)
        
        # Add manual CORS headers as workaround
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        
        return response

    except Exception as e:
        response = Response({
            'success': False,
            'message': f'Login failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Add manual CORS headers as workaround
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        
        return response

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_users(request):
    """
    Get all users (admin only)
    """
    try:
        users = User.objects.all().order_by('date_joined')
        users_data = [serialize_user(user) for user in users]

        return Response({
            'users': users_data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'message': f'Failed to fetch users: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def change_user_role(request):
    """
    Change user role (admin only)
    """
    try:
        data = request.data
        user_id = data.get('userId')
        new_role = data.get('newRole')

        if not all([user_id, new_role]):
            return Response({
                'success': False,
                'message': 'User ID and new role are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get the user to modify
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Prevent admin from demoting themselves
        if user.id == request.user.id and new_role != 'admin':
            return Response({
                'success': False,
                'message': 'Cannot change your own admin role'
            }, status=status.HTTP_403_FORBIDDEN)

        # Update user role
        if new_role == 'admin':
            user.is_superuser = True
            user.is_staff = True
        elif new_role == 'moderator':
            user.is_superuser = False
            user.is_staff = True
        else:  # user
            user.is_superuser = False
            user.is_staff = False

        user.save()

        return Response({
            'success': True,
            'message': f'User role updated to {new_role} successfully'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'success': False,
            'message': f'Failed to update role: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def toggle_user_status(request):
    """
    Toggle user active status (admin only)
    """
    try:
        data = request.data
        user_id = data.get('userId')

        if not user_id:
            return Response({
                'success': False,
                'message': 'User ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get the user to modify
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': 'User not found'
            }, status=status.HTTP_404_NOT_FOUND)

        # Prevent admin from deactivating themselves
        if user.id == request.user.id:
            return Response({
                'success': False,
                'message': 'Cannot deactivate your own account'
            }, status=status.HTTP_403_FORBIDDEN)

        # Toggle user status
        user.is_active = not user.is_active
        user.save()

        status_text = 'activated' if user.is_active else 'deactivated'
        return Response({
            'success': True,
            'message': f'User {status_text} successfully'
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'success': False,
            'message': f'Failed to update status: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
