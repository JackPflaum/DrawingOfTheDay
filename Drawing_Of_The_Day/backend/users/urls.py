from django.urls import path
from users.views import views
from rest_framework_simpleJWT import views as jwt_views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('logout/', views.logout, name='logout'),
    path('token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]