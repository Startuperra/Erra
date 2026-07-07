from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TelegramAuthView, TestViewSet, DashboardView

router = DefaultRouter()
router.register(r'tests', TestViewSet, basename='test')

urlpatterns = [
    path('auth/telegram/', TelegramAuthView.as_view(), name='telegram-auth'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('', include(router.urls)),
]
