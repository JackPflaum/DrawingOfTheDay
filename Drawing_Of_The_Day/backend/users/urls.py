from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenBlacklistView, TokenRefreshView

urlpatterns = [
    path('check-auth/', views.check_authorization, name='check_authorization'),
    path('signup/', views.signup, name='signup'),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('profile/', views.profile, name='profile'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]