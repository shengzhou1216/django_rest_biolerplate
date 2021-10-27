from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
import logging
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer
from core.response import Success, Error
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import User
from rest_framework.authtoken.models import Token
from django.core import serializers

# Create your views here.
@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Success(status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    # validate password
    user = User.get_by_email(request.data['email'])
    if user is None or not user.check_password(request.data['password']):
        return Error(status=status.HTTP_404_NOT_FOUND, error='用户名或密码错误')

    token, created = Token.objects.get_or_create(user=user)
    return Success(data={'token': token.key}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def info(request):
    r = serializers.serialize('json', [request.user, ])
    return Success(data=UserSerializer(request.user).data)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-created')
    serializer_class = UserSerializer