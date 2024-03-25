from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenBlacklistView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('check-auth/', views.check_authorization, name='check_authorization'),
    path('signup/', views.signup, name='signup'),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('profile/<int:user_id>', views.profile, name='profile'),
    path('delete-image/', views.delete_image, name='delete_image'),
    path('delete-account/', views.delete_account, name='delete_account'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)    # serves uploaded media files during development