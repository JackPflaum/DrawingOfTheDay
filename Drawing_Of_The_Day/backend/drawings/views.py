from datetime import date, datetime, timedelta
from django.core.exceptions import ValidationError, PermissionDenied
from django.utils import timezone
from .models import ImagePrompt, Image, Like
from rest_framework.response import Response
from .serializers import ImageSerializer, LikeSerializer
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status


@api_view(['GET'])
def home(request):
    """home view for presenting images uploaded by users"""
    # get date from date options (default is todays date)
    # default date: gets current date and formats to string
    date_str = request.GET.get('date', datetime.today().strftime('%Y-%m-%d'))

    # get the order in which images are displayed (default to most recent upload)
    order_option = request.GET.get('order_option', '-upload_date')

    # '__date' only filters the images based on date and not date and time.
    images = Image.objects.filter(upload_date__date=date_str).order_by(order_option)
    images_data = ImageSerializer(images, many=True).data

    # get image prompt object for particular date and extract prompt_text
    image_prompt = ImagePrompt.objects.filter(date=date_str).first()
    image_prompt_data = image_prompt.prompt_text if image_prompt else None

    context = {'date': date_str,
               'imagePrompt': image_prompt_data if image_prompt_data else 'Sorry, No Image Prompt Today.',
               'imagesList': images_data,
               'orderOption': order_option,
               }
    
    return Response(context, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])    # using parsers to handle both form submissions and file uploads
def upload_image(request):
    """uploads user image to database"""
    try:
        # check if user has already submitted an image today
        user = request.user
        current_date = timezone.now()
        start_of_day = timezone.make_aware(timezone.datetime(current_date.year, current_date.month, current_date.day))
        end_of_day = timezone.make_aware(timezone.datetime(current_date.year, current_date.month, current_date.day, 23, 59, 59, 999999))

        # checking date with __range because upload_date is DateTimeField and we need to take into account date and time.
        already_uploaded = Image.objects.filter(user=user, upload_date__range=(start_of_day, end_of_day)).exists()

        if already_uploaded:
            return Response({'error': 'Sorry, you can only submit one drawing per day.'}, status=status.HTTP_409_CONFLICT)

        # get the image file and check file size is within set limit
        image = request.FILES.get('imageFile')

        megabyte_limit = 5
        if image.size > megabyte_limit * 1024 * 1024:
            raise ValidationError('Image size exceeds the allowable limit of 5MB')

        # get image text prompt using current date
        # cannot submit for previous days
        image_prompt = ImagePrompt.objects.get(date=current_date)
        
        # save image file to Image model
        Image.objects.create(image_prompt=image_prompt, user=request.user, image=image)
        return Response({'success': 'Image uploaded successfully'}, status=status.HTTP_201_CREATED)

    except PermissionDenied:
        return Response({'error': 'Unauthorized access'}, status=status.HTTP_401_UNAUTHORIZED)
    except ImagePrompt.DoesNotExist:
        return Response({'error': 'Image Prompt not found for given date.'}, status=status.HTTP_404_NOT_FOUND)
    except ValidationError as validation_error:
        return Response({'error': str(validation_error)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as error:
        return Response({'error': 'Image was not uploaded due to internal server error:',}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def image_likes(request):
    """get image likes and dislikes count. If user is logged in and has already liked or dislikes someones image
    then send back true"""
    image_likes = []

    # retrieve image ids from request paramaters
    image_ids = request.GET.getlist('image_ids')

    # append likes data to image ids
    for image_id in image_ids:
        image = Image.objects.filter(id=id).first()
        like_dislike_count = LikeSerializer(image, context={'request': request}).data
        image_likes.append({image_id: like_dislike_count})

    return Response(image_likes, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def like_dislike(request):
    """save users like or dislike response to an image"""
    try:
        user = request.user
        like_status = request.data.get('likeStatus')
        image_id = request.data.get('imageId')

        # get image that is being liked or disliked.
        image = Image.objects.get(id=image_id)

        # check if user has already liked or disliked the image and overwrite previous like_status if so.
        like = Like.objects.filter(user=user, image=image).first()

        if like is not None:
            # null means user is taking away their previous like or dislike response.
            if like_status is None:
                like.delete()
                return Response({'success': 'Like status deleted successfully'}, status=status.HTTP_200_OK)
            else:
                like.like_status = like_status
                like.save()
                return Response({'success': 'Like status successfully submitted'}, status=status.HTTP_201_CREATED)

        # if user has not liked or disliked image before then save like_status to Like model.
        Like.objects.create(user=user, image=image, like_status=like_status)
        return Response({'success': 'Like status successfully submitted'}, status=status.HTTP_201_CREATED)

    except PermissionDenied:
        return Response({'error': 'Unauthorized access'}, status=status.HTTP_401_UNAUTHORIZED)
    except Image.DoesNotExist:
        return Response({'error': 'Image not found for given id'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as error:
        print(f'Error: {error}')
        return Response({'error': 'Like or dislike response was not submitted due to internal server error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

