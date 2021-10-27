from rest_framework import serializers
from .models import User
from rest_framework.validators import ValidationError
from django.utils.translation import ugettext_lazy as _

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    
    confirm_password = serializers.CharField(
        required=True, error_messages={'required': '确认密码不能为空'})

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'confirm_password']
        extra_kwargs = {
            'username': {
                'error_messages': {
                    'required': '用户名不能为空', 'max_length': _('用户名不超过{max_length}位'), 'unique': '用户名已存在'
                }
            },
            'email': {
                'error_messages': {
                    'required': '邮箱不能为空', 'unique': '邮箱已存在', 'invalid': '邮箱格式错误'}
            },
            'password': {
                'error_messages': {
                    'required': '密码不能为空', 'blank': '确认密码不能为空', 'min_length': _('密码不少于{min_length}位'), 'max_length': _('密码不超过{max_length}位')
                },
            }
        }

    #  not set confirm_password field
    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

    def validate(self, data):
        # Apply custom validation either here, or in the view.
        if data['password'] != data['confirm_password']:
            raise ValidationError('两次输入密码不一致')
        return data


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(error_messages={
        'required': '邮箱不能为空', 'invalid': '邮箱格式错误'
    })
    password = serializers.CharField(max_length=18, min_length=6, error_messages={
        'required': '密码不能为空', 'blank': '确认密码不能为空', 'min_length': _('密码不少于{min_length}位'), 'max_length': _('密码不超过{max_length}位')
    })

    class Meta:
        fields = ['email', 'password']
