<template>
  <div class="body-wrap">
		<div class="main-wrap">
			<img src="https://uniapp.v5.niuteam.cn/app/shop/view/public/img/login-left.png" alt="" class="login-leftbg light">
			<img src="https://uniapp.v5.niuteam.cn/app/shop/view/public/img/login-left-dark.png" alt="" class="login-leftbg dark">

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
.dark .body-wrap {
  background-color: #212121;
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
.dark img.light{
  display: none;
}
.dark img.dark{
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
