from rest_framework import serializers
from django.contrib.auth.models import User


class UserSignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password1 = serializers.CharField(write_only=True)    # 'write_only=True' means input only and not included in serializer output response
    password2 = serializers.CharField(write_only=True)

    def validate_email(self, value):
        """check if email is unique"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError({'error': 'A user is already using this email.'})
        return value;

    def validate(self, data):
        # validate all fields have been filled in
        if not (data.get('username') and data.get('email') and data.get('password1') and data.get('password2')):
            raise serializers.ValidationError({'error': 'All fields are required!'})

        # validate passwords are matching
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({'error': 'Passwords do not match.'})
        return data
    

class UserSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']