from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Create your views here.
def custom404(request, exception=None):
    return Response({
        'code': 404,
        'error': '资源 %s 未找到' % request.path,
    }, status=404)


@api_view(['GET'])
def hello(request, exception=None):
    return Response({
        'code': 200,
        'message': 'Hello {}'.format(request.META.get('REMOTE_ADDR')),
    }, status=200)
