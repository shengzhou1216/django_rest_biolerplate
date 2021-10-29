<template>
  <div class="login-container">
    <el-form ref="registerForm" :model="registerForm" :rules="registerRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">注册</h3>
      </div>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input
          ref="email"
          v-model.trim="registerForm.email"
          placeholder="邮箱"
          name="email"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model.trim="registerForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="2"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model.trim="registerForm.password"
          :type="passwordType"
          placeholder="密码"
          name="password"
          tabindex="3"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="confirm_password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="confirm_passwordType"
          ref="confirm_password"
          v-model.trim="registerForm.confirm_password"
          :type="confirm_passwordType"
          placeholder="确认密码"
          name="confirm_password"
          tabindex="4"
          auto-complete="on"
          @keyup.enter.native="handleRegister"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="confirm_passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <div>
        <el-button tabindex="5" :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleRegister">注册</el-button>
      </div>
      <div>
        <el-button tabindex="6" :disabled="loading" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      </div>
    </el-form>

  </div>
</template>

<script>
import { register } from '@/api/user'
export default {
  name: 'Register',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error(`请输入密码`))
        return
      }
      if (value.length < 6) {
        callback(new Error('密码不低于6位'))
        return
      }
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        callback(new Error('密码需要至少包含数字与字母'))
        return
      }
      callback()
    }
    const validateconfirm_password = (rule, value, callback) => {
      if (!value) {
        callback(new Error(`请输入确认密码`))
        return
      }
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致，请重新输入'))
      } else {
        callback()
      }
    }

    return {
      registerForm: {
        email: undefined,
        username: undefined,
        password: undefined,
        confirm_password: undefined
      },
      registerRules: {
        email: [{ type: 'email', required: true, trigger: 'blur', message: '请输入正确的邮箱地址' }],
        username: [{ required: true, trigger: 'blur', message: '请输入用户名' }, { max: 30, trigger: 'blur', message: '用户名最长不超过30个字符' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        confirm_password: [{ required: true, trigger: 'blur', validator: validateconfirm_password }]
      },
      loading: false,
      passwordType: 'password',
      confirm_passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true
          register(this.registerForm).then(res => {
            this.$message.success('注册成功！')
            this.$router.push({ path: '/login' })
          }).finally(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    handleLogin() {
      this.$router.push({ path: '/login' })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
