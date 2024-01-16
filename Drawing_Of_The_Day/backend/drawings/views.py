from datetime import date, datetime, timezone
from .models import ImagePrompt, Image, Like
from rest_framework.response import Response
from .serializers import ImageSerializer, ImagePromptSerializer
from rest_framework.decorators import api_view, parser_classes
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

    # get likes and dislikes count from Like model count function?

    # get image prompt text for particular date
    image_prompt = ImagePrompt.objects.filter(date=date_str).first()
    image_prompt_data = ImagePromptSerializer(image_prompt).data if image_prompt else None

    context = {'date': date_str,
               'imagePrompt': image_prompt_data if image_prompt_data else 'Sorry, No Image Prompt Today.',
               'images': images_data,
               'orderOption': order_option,
               }
    
    return Response(context, status=status.HTTP_200_OK)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])    # using parsers to handle both form submissions and file uploads
def upload_image(request):
    """uploads user image to database"""

    try:
        # get the image file and image text prompt using current date
        image = request.FILES.get('imageFile')
        date = timezone.now().date()
        image_prompt = ImagePrompt.objects.filter(date=date).first()

        if not image_prompt:
            return Response({'error': 'Image Prompt not found for given date.'}, status=status.HTTP_404_NOT_FOUND)
        
        # save image file to Image model
        Image.objects.create(image_prompt=image_prompt, user=request.user, image=image)
        return Response({'success': 'Image uploaded successfully'}, status=status.HTTP_201_CREATED)
    except Exception as error:
        print(error)
        return Response({'error': 'Error uploading image'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
