from django.db import models
from django.contrib.auth.models import User


class ImagePrompt(models.Model):
    date = models.DateField()
    prompt_text = models.TextField()

    def __str__(self):
        return f'Image Prompt: {self.date}'


class Image(models.Model):
    image_prompt = models.ForeignKey(ImagePrompt, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.FileField(upload_to='images/')
    upload_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} uploaded image on {self.upload_date}'


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    like_status = models.BooleanField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} liked or unliked image {self.image}'