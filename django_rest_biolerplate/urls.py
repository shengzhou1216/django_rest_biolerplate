"""django_rest_biolerplate URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from user import views as UserViews
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from rest_framework import routers
from core import views as CoreViews

# custome error view
handler404 = CoreViews.custom404
handler500 = 'rest_framework.exceptions.server_error'

router = routers.DefaultRouter()
router.register(r'users', UserViews.UserViewSet)

urlpatterns = [
    path('hello/', CoreViews.hello),
    path('api/', include(router.urls)),
    path('api/auth/register/', UserViews.register),
    path('api/auth/login/', UserViews.login),
    path('api/auth/info/', UserViews.info),
]

