from django.contrib.auth.models import User
from .serializers import UserSignupSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import make_password
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_authorization(request):
    """check if the user is authenticated"""
    # if user is authenticated then they will have access to this view and return true value
    context = {'user': True }
    return Response(context)


@api_view(['POST'])
@permission_classes([AllowAny])    # allows permission for anyone to access this view
def signup(request):
    """handling user signup and authorising user"""

    # get serialized user signup data
    serializer = UserSignupSerializer(data=request.signupData)

    # validate data
    if serializer.is_valid():
        # data valid,therefore create new user
        user = User.objects.create_user(username=serializer.validated_data['username'],
            email=serializer.validated_data['email'], 
            password=make_password(serializer.validated_data['password1']))    # 'make_password()' hashes password for encrypted storage

        # generate an access token for client-side authentication
        access_token = RefreshToken.for_user(user).access_token
        refresh_token = RefreshToken.for_user(user)

        return Response({'access': str(access_token), 'refresh': str(refresh_token)}, status=status.HTTP_201_CREATED)
    else:
        # invalid data, return error message
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['POST'])
@permission_classes([IsAuthenticated])    # checks if the request contains a valid user authentication token
def logout(request):
    """handle user logout"""
    try :
        # get JWT refresh token so it can be invalidated and user cannot access areas requiring user login
        refresh_token = request.refreshToken.get('refreshToken')
        
        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        # blacklist(i.e. invalidate) the refresh token
        RefreshToken(refresh_token).blacklist()

        return Response({'success': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
