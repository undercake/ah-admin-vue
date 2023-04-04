<template>
  <div class="body-wrap">
    <div class="main-wrap">
      <img src="/static/back-light.png" alt="" class="login-leftbg light" />
      <img src="/static/back-dark.jpg" alt="" class="login-leftbg dark" />

      <div class="form-wrap layui-form">
        <el-switch
          v-model="is_dark"
          class="mt-2"
          inline-prompt
          :active-icon="Moon"
          :inactive-icon="Sun"
          size="large"
          style="--el-switch-on-color: #4f24e1;"
          @change="handle_change"
        />
        <Login @login="to_log" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Login from "@/components/Login.vue";
import { useRouter } from "vue-router";
import { localGet } from "../utils";
import { ref, h, getCurrentInstance } from "vue";

const Moon = h("i", { class: "fa-solid fa-moon" });
const Sun = h("i", { class: "fa-solid fa-sun", style:"color:rgb(223 194 4)" });
const { mittBus } = getCurrentInstance().appContext.config.globalProperties;
let is_dark = ref(document.querySelector("html").classList.contains("dark"));
const handle_change = (d) => mittBus.emit("dark-mode", d);

const router = useRouter();
const to_log = (e) => {
  const nextPath = localGet("beforeLoin", "/");
  router.push(nextPath);
};
</script>

<style scoped>
.body-wrap {
  flex: 1;
  height: 0;
  color: #333;
  background: #f7f8fa;
}
.dark .body-wrap {
  background-color: #4f24e1;
}
.body-wrap .main-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
img {
  border: none;
}

img.light {
  display: block;
}
img.dark {
  display: none;
}
.dark img.light {
  display: none;
}
.dark img.dark {
  display: block;
}
.main-wrap {
  width: 1200px;
  margin: 0 auto;
}
.body-wrap .login-leftbg {
  width: 570px;
}
.body-wrap .form-wrap {
  width: 440px;
  background: #fff;
  border-radius: 4px;
  padding: 50px 40px;
  box-sizing: border-box;
}
.dark .body-wrap .form-wrap {
  background-color: #333;
}
.form-wrap {
  background-color: #fff;
  padding: 15px 0;
  border-radius: 5px;
}
.login-form >>> .el-form--label-top .el-form-item__label {
  padding: 0;
}
.login-form >>> .el-form-item {
  margin-bottom: 0;
}
</style>

<style>
.el-input-group__prepend {
  padding: 0 0.9rem;
}
.layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
