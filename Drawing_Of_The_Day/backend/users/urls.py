from django.urls import path
from . import views
from.views import CustomTokenObtainTokenPair
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.views import TokenBlacklistView

urlpatterns = [
    path('check-auth/', views.check_authorization, name='check_authorization'),
    path('signup/', views.signup, name='signup'),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('token/', CustomTokenObtainTokenPair.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]