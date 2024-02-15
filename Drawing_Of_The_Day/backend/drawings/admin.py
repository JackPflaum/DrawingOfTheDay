from django.contrib import admin
from .models import Image, ImagePrompt, Like

class ImageAdmin(admin.ModelAdmin):
    list_display = ('user', 'image_prompt', 'upload_date')


class ImagePromptAdmin(admin.ModelAdmin):
    list_display = ('date', 'prompt_text')


class LikeAdmin(admin.ModelAdmin):
    list_display = ('user', 'image', 'like_status', 'timestamp')


admin.site.register(Image, ImageAdmin)
admin.site.register(ImagePrompt, ImagePromptAdmin)
admin.site.register(Like, LikeAdmin)
