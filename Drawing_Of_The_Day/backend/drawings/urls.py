from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('home/', views.home, name='home'),
    path('upload-image/', views.upload_image, name='upload_image'),
    path('image-likes-no-auth/', views.image_likes_no_auth, name='image_likes_no_auth'),
    path('image-likes-auth/', views.image_likes_auth, name='image_likes_auth'),
    path('like-dislike/', views.like_dislike, name='like_dislike'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)    # serves uploaded media files during development