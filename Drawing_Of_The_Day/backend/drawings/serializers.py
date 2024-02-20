from rest_framework import serializers
from .models import Image, ImagePrompt
from datetime import datetime


class ImageSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    prompt = serializers.SerializerMethodField()
    prompt_date = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ['id', 'user', 'url', 'prompt', 'prompt_date', 'username']

    def get_url(self, obj):
        return obj.image.url if obj.image else None

    def get_prompt(self, obj):
        """get image prompt text from foreignkey connection with ImagePrompt model"""
        return obj.image_prompt.prompt_text if obj.image_prompt.prompt_text else None
    
    def get_prompt_date(self, obj):
        """get the date of when the image prompt was published"""
        return obj.image_prompt.date.strftime('%d %B %Y') if obj.image_prompt.date else None

    def get_username(self, obj):
        """get username from foreignkey connection with User model"""
        return obj.user.username if obj.user else None


class LikeSerializer(serializers.ModelSerializer):
    # 'likes_count' automatically associated with 'get_likes' method because of naming convention
    likes_dislikes_count = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ['likes_dislikes_count']

    def get_likes_dislikes_count(self, obj):
        """calculate likes and dislikes count for the associated image"""
        return obj.count_likes_dislikes()


class ImagePromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagePrompt
        fields = ['date', 'prompt_text']