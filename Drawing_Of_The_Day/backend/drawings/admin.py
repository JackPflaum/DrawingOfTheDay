from django.contrib import admin
from .models import Image, ImagePrompt, Like


admin.site.register(Image)
admin.site.register(ImagePrompt)
admin.site.register(Like)
