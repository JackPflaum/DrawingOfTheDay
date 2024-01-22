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
    
    def count_likes(self):
        """counts the likes and dislikes based on reverse relationship with Like model"""
        # 'like_set' is the default reverse relationship name
        # accessing the 'like_status' field in the 'Like' model using relationship name
        likes_count = self.like_set.filter(like_status=True).count()    # True represents a like
        dislikes_count = self.like_set.filter(like_status=False).count()    # False represents a dislike
        return {'likes': likes_count, 'dislikes': dislikes_count}


class Like(models.Model):
    """Like model for holding users likes and dislikes of uploaded images"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ForeignKey(Image, on_delete=models.CASCADE)
    like_status = models.BooleanField()    # true represents like and false represents dislikes
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} liked or unliked image {self.image}'