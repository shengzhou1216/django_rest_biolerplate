from rest_framework import status
from django.utils.translation import gettext_lazy as _


class ApiException(Exception):
    # default_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    # default_detail = _('服务器出错了')

    # def __init__(self, detail=None, status_code=None):
    #     if detail is None:
    #         detail = self.default_detail
    #     if status_code is None:
    #         status_code = self.default_code

    # def __str__(self):
    #     return str(self.default_detail)
    """
    Base class for REST framework exceptions.
    Subclasses should provide `.status_code` and `.default_detail` properties.
    """
    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    default_detail = _('服务器出错了')
    default_code = 'error'

    def __init__(self, detail=None, code=None, status_code=None):
        if detail is None:
            detail = self.default_detail
        if code is None:
            code = self.default_code
        if status_code is None:
            status_code = self.status_code

        self.detail = detail
        self.code = code
        self.status_code = status_code

    def __str__(self):
        return str('%s - %s - %s' % (self.detail, self.code, self.status_code))
