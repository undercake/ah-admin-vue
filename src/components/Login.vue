<template>
  <el-form
    @keydown.enter="submitForm"
    :rules="state.rules"
    :model="state.ruleForm"
    ref="loginForm"
    class="login-form"
  >
  <h2 class="login-title">阿惠家政·管理中心</h2>
    <el-form-item style="margin-top: 25px" prop="username">
      <el-input
        placeholder="账号"
        type="text"
        v-model.trim="state.ruleForm.username"
        autocomplete="off"
        size="large"
      >
        <template #prepend>
          <i class="fa-solid fa-user" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item style="margin-top: 25px" prop="password">
      <el-input
        placeholder="密码"
        type="password"
        v-model.trim="state.ruleForm.password"
        autocomplete="off"
        size="large"
      >
        <template #prepend>
          <i class="fa-solid fa-lock" />
        </template>
      </el-input>
    </el-form-item>
    <el-form-item style="margin-top: 25px" prop="captcha">
      <el-input
        placeholder="验证码"
        type="text"
        v-model.trim="state.ruleForm.captcha"
        autocomplete="off"
        maxlength="5"
        size="large"
        class="end-nopadding"
      >
        <template #prepend>
          <i class="fa-solid fa-shield-check" />
        </template>
        <template #append>
          <el-image
            @click="changeRandom"
            :src="urls.captcha + '?__' + state.random"
            fit="cover"
          >
            <template #placeholder>
              <div class="image-slot">
                验证码加载中<span class="dot">...</span>
              </div>
            </template>
          </el-image>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item style="margin-top: 25px">
      <el-button style="width: 100%" type="primary" @click="submitForm"
        >立即登录</el-button
      >
    </el-form-item>
  </el-form>
</template>
<script setup>
import axios from "axios";
import md5 from "js-md5";
import { getCurrentInstance, ref, reactive, onMounted } from "vue";
import { localSet } from "../utils";
const { urls, showMsg } =
  getCurrentInstance().appContext.config.globalProperties;
const loginForm = ref(null);
let timer = 0;

const state = reactive({
  random: 0,
  ruleForm: {
    username: "",
    password: "",
    captcha: "",
  },
  rules: {
    username: [{ required: "true", message: "账户不能为空", trigger: "blur" }],
    password: [{ required: "true", message: "密码不能为空", trigger: "blur" }],
    captcha: [
      { required: "true", message: "验证码不能为空", trigger: "blur" },
      { len: 5, message: "验证码长度为5位", trigger: "blur" },
    ],
  },
});

onMounted(() => {
  timer = setInterval(() => {
    if (
      !document.querySelector("img.el-image__inner") ||
      document.querySelector("img.el-image__inner").width == 0
    )
      changeRandom();
    else clearInterval(timer);
  }, 6000);
});

const logging = defineEmits();
const logined = (e) => logging("login", e);

const changeRandom = () => {
  state.random = Math.random();
  state.ruleForm.captcha = "";
};
const submitForm = async () => {
  loginForm.value.validate((valid, err) => {
    if (valid) {
      const { username, captcha, password } = state.ruleForm;
      axios
        .post(urls.login, { username, passwordMd5: md5(password), captcha })
        .then(({ data }) => {
          if (data.code === 0) {
            localSet("login", true);
            localSet("user_nickname", data.nickname);
            localSet("user_group", data.group);
            // getUserRights();
            logined();
          } else {
            changeRandom();
            console.warn(data);
            showMsg.err(data.message);
          }
        })
        .catch((e) => {
          console.error(e);
          changeRandom();
        });
    } else {
      console.log(err, "error submit!!");
      return false;
    }
  });
};
</script>
<style scoped>
.el-image{
  height: 38px;
  text-align: center;
  color: #999;
  cursor: pointer;
}
.body-wrap .form-wrap .login-title {
    font-size: 30px;
    line-height: 36px;
    color: #000;
    font-weight: 400;
    text-align: center;
    margin-bottom: 30px;
}
</style>
<style>
.end-nopadding .el-input-group__append {
  padding: 0 1px;
}
</style>