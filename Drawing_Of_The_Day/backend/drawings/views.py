import datetime
from django.shortcuts import render
from .models import ImagePrompt, Image, Like
from django.http import JsonResponse


def home(request):
    """home view for presenting images uploaded by users"""
    # get date from date options (default is todays date if not chosen)
    date_str = request.GET.get('date', str(datetime.today().date()))

    try:
        date = datetime.strptime(date_str, '%d-%m-%Y').date()
    except ValueError:
        return f'Error: {ValueError}'
    
    # default to most recent (or most liked)
    order_option = request.GET.get('order_option', 'id')
    if order_option == 'recent':
        image_order = date

    images = Image.objects.filter(upload_date=date).order_by(image_order)

    # get likes and dislikes count from Like model count function?

    image_prompt = ImagePrompt.objects.filter(date=date)

    context = {'date': date,
               'image_prompt': image_prompt,
               'images': images,}
    
    return JsonResponse(context)