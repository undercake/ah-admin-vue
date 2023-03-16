<template>
  <div class="login-body">
    <div class="login-container">
      <div class="head">
        <img class="logo" :src="urls.BaseUri + '/static/logo.png'" />
      </div>
      <Login @login="to_log" />
    </div>
  </div>
</template>

<script setup>
import Login from "@/components/Login.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const to_log = e=>{
  console.log(e);
  router.push("/");
}
</script>

<style scoped>
.login-body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #fff;
}
.login-container {
  width: 420px;
  /* height: 500px; */
  padding-bottom: 50px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0px 21px 41px 0px rgba(0, 0, 0, 0.2);
}
.head {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 0 0;
}
.head img {
  max-width: 200px;
}
.head .title {
  font-size: 28px;
  color: #1baeae;
  font-weight: bold;
}
.head .tips {
  font-size: 12px;
  color: #999;
}
.login-form {
  width: 70%;
  margin: 0 auto;
}
.login-form >>> .el-form--label-top .el-form-item__label {
  padding: 0;
}
.login-form >>> .el-form-item {
  margin-bottom: 0;
}
.el-image{
  width: 147px;
  height: 32px;
  text-align: center;
  color: #999;
}
</style>

<style>
.el-input-group__prepend{
  padding: 0 .9rem;
}
</style>
