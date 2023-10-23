<template>
  <div class="login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <h3 class="title">报名系统后台</h3>
      <el-form-item prop="username" label="账号" label-width="50px">
        <el-input
          name="username"
          label="账号"
          v-model="loginForm.username"
          type="text"
          auto-complete="off"
          placeholder="账号"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password" label="密码" label-width="50px">
        <el-input
          v-model="loginForm.password"
          type="password"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        >
        </el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button
          :loading="loading"
          size="medium"
          type="primary"
          style="width: 100%"
          @click.native.prevent="handleLogin"
        >
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from "@/api/login";
import { setToken } from "@/utils/auth";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        // username: "12345678",
        // password: "Dlu@12345678",
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" },
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" },
        ],
      },
      loading: false,
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          login(this.loginForm.username, this.loginForm.password).then(
            (res) => {
              if (res["status_code"] === 10000) {
                this.loading = false;
                setToken(res.data.token);
                this.$router.push("/info");
              }
            }
          );
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: linear-gradient(to bottom, #c1dbf9, #f7f7f7);
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 55%;
  padding: 9% 32% 5px 25px;
  height: 65%;
  position: relative;
  .el-form-item.is-required .el-form-item__label:before {
    content: "" !important;
  }
  &:before {
    background: url("../assets/images/login_bg.jpg") no-repeat;
    content: "";
    position: absolute;
    background-size: 100% 100%;
    width: 49%;
    height: 81%;
    left: 47%;
    top: 10%;
  }
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
