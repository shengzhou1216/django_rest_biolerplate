from rest_framework.exceptions import NotAuthenticated
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging
from rest_framework.pagination import PageNumberPagination


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)
    # Now add the HTTP status code to the response.
    logging.exception('%s - %s - %s' %
                      (context['view'], context['request'].method, exc))
    if response is not None:
        if isinstance(exc, NotAuthenticated):
            errors = '用户未认证，请先登录'
        elif response.data is not None:
            if isinstance(response.data, str):
                errors = [response.data]
            elif isinstance(response.data, dict):
                errors = [((y for y in x)if isinstance(x, list) else x)
                          for x in list(response.data.values())]
        response.data = {'error': errors}
        response.data['code'] = response.status_code
    else:
        response = Response(
            status=exc.status_code if hasattr(exc, 'status_code') else status.HTTP_500_INTERNAL_SERVER_ERROR, data={'error': exc.detail if hasattr(exc, 'detail') else '服务器出错了'}
        )
    return response


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'limit'
    page_query_param = 'page'
    max_page_size = 1000
    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'results': data
        })