from rest_framework import serializers
from .models import Image, ImagePrompt


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'url', 'user']


class ImagePromptSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagePrompt
        fields = ['date', 'prompt_text']