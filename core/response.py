from rest_framework.response import Response
from rest_framework import status

def Success(data=None, message="操作成功", status=status.HTTP_200_OK):
    return Response(data={'data': data, 'message': message, "code": 0}, status=status)


def Error(error="服务器错误", status=status.HTTP_500_INTERNAL_SERVER_ERROR):
    return Response(data={'error': error}, status=status)
