<template>
  <!-- <div class="login-body">
    <div class="login-container">
      <div class="head">
        <img class="logo" :src="urls.BaseUri + '/static/logo.png'" />
      </div>
    </div>
  </div> -->

  <div class="body-wrap">
		<div class="main-wrap">
			<img src="https://uniapp.v5.niuteam.cn/app/shop/view/public/img/login-left.png" alt="" class="login-leftbg">

			<div class="form-wrap layui-form">
        <Login @login="to_log" />
			</div>
		</div>
	</div>

</template>

<script setup>
import Login from "@/components/Login.vue";
import { useRouter } from "vue-router";
import { localGet } from "../utils";

const router = useRouter();
const to_log = e=>{
  const nextPath = localGet('beforeLoin', '/');
  router.push(nextPath);
}
</script>

<style scoped>
.body-wrap {
    flex: 1;
    height: 0;
    color: #333;
    background: #F7F8FA;
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
.form-wrap {
    background-color: #fff;
    padding: 15px 0;
    border-radius: 5px;
}
/* .body-wrap {
    flex: 1;
    height: 0;
}
.login-body {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background-color: #fff;
}
.login-container {
  width: 420px;
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
} */
/* .login-form {
  margin: 0 auto;
} */
.login-form >>> .el-form--label-top .el-form-item__label {
  padding: 0;
}
.login-form >>> .el-form-item {
  margin-bottom: 0;
}
</style>

<style>
.el-input-group__prepend{
  padding: 0 .9rem;
}
.layout {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
}
</style>
