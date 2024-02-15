from django.contrib.auth.models import User
from .serializers import UserSignupSerializer, UserSerializer
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.hashers import make_password
from django.contrib.auth import login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from backend.drawings.models import Image
from backend.drawings.serializers import ImageSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_authorization(request):
    """check if the user is authenticated"""
    # if user is authenticated then they will have access to this view and return username
    # get user details and return it to frontend
    username = request.user.username
    context = {'username': username }
    return Response(context)


@api_view(['POST'])
@permission_classes([AllowAny])    # allows permission for anyone to access this view
def signup(request):
    """handling user signup and authorising user"""
    try:    
        # get signup data from frontend
        signup_data = request.data.get('signupData')

        # get serialized user signup data
        serializer = UserSignupSerializer(data=signup_data)

        # validate data
        if serializer.is_valid(raise_exception=True):
            # data valid, therefore create new user
            user = User.objects.create_user(username=serializer.validated_data['username'],
                email=serializer.validated_data['email'], 
                password=serializer.validated_data['password1'])

            # generate an access token for client-side authentication
            access_token = RefreshToken.for_user(user).access_token
            refresh_token = RefreshToken.for_user(user)

            return Response({'access': str(access_token), 'refresh': str(refresh_token)}, status=status.HTTP_201_CREATED)
        else:
            return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

    except serializers.ValidationError as validation_error:
        return Response({'error': str(validation_error)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as error:
        return Response({'error': str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """user profile page for presenting user images that they have uploaded"""
    try:
        # get user images, serialize data and return to profile page
        user = request.user
        user_images = Image.objects.filter(user=user).order_by('-upload_date')
        image_data = ImageSerializer(user_images, many=True).data if user_images else None
    except User.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        return Response({'error': str(error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'images': image_data})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_image(request):
    """allow users to delete their own image"""
    try:
        user = request.user
        image_id = request.data.get('imageId')
        image = Image.objects.get(user=user, id=image_id)    

        image.delete()

        return Response({'success': 'Drawing has been successfully deleted.'}, status=status.HTTP_200_OK)
    except Image.DoesNotExist:
        return Response({'error': 'Drawing not found or you do not have permission to delete this drawing'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        return Response({'error': f'Something went wrong: {str(error)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
