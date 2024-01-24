from django.urls import path
from . import views
from rest_framework_simplejwt import views as jwt_views
from rest_framework_simplejwt.views import TokenBlacklistView

urlpatterns = [
    path('check-auth/', views.check_authorization, name='check_authorization'),
    path('signup/', views.signup, name='signup'),
    path('logout/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]