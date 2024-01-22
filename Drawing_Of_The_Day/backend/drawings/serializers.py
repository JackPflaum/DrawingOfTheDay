from rest_framework import serializers
from .models import Image, ImagePrompt


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'url', 'user']


class LikeSerializer(serializers.ModelSerializer):
    # 'likes_count' automatically associated with 'get_likes' method because of naming convention
    likes_count = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = ['likes_count']

    def get_likes_count(self, obj):
        """calculate likes and dislikes count for the associated image"""
        return obj.count_likes()


class ImagePromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagePrompt
        fields = ['date', 'prompt_text']