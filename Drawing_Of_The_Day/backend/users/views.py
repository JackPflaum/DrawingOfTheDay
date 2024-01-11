from django.contrib.auth.models import User
from .serializers import UserSignupSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import make_password
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken


@api_view(['POST'])
@permission_classes([AllowAny])    # allows permission for anyone to access this view
def signup(request):
    """handling user signup and authorising user"""

    # get serialized user signup data
    serializer = UserSignupSerializer(data=request.signupData)

    # validate data
    if serializer.is_valid():
        # data valid, create new user
        user = User.objects.create_user(username=serializer.validated_data['username'],
            email=serializer.validated_data['email'], 
            password=make_password(serializer.validated_data['password1']))    # 'make_password()' hashes password for encrypted storage

        # log user in once created
        login(request, user)

        # generate an access token for client-side authentication
        access_token = RefreshToken.for_user(user).access_token
        refresh_token = RefreshToken.for_user(user)

        return Response({'access_token': str(access_token), 'refresh_token': str(refresh_token)}, status=status.HTTP_201_CREATED)
    else:
        # invalid data, return error message
        return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)