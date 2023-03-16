<template>
  <div class="layout">
    <router-view />
  </div>
</template>

<script setup>
import { reactive, onMounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { localSet, pathMap } from "@/utils";
import axios from "axios";

const noMenu = ["/login"];
const router = useRouter();
const state = reactive({
  showMenu: true,
  defaultOpen: ["1", "2", "3", "4"],
  currentPath: "/",
});

const {urls} = getCurrentInstance().appContext.config.globalProperties;

onMounted(()=>{
  axios.get(urls.isLogged)
    .then(({data})=>{
      console.log(data);
      if (!data.is_login) {
        router.push({ path: '/login' });
      }
    })
    .catch(e=>console.log(e));
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #ffffff;
}
</style>

<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.bg-green .el-card,
.bg-orange .el-card,
.bg-red .el-card,
.bg-blue .el-card {
  background: rgba(255, 255, 255, 0.7);
}

.bg-green
{
  background-color: #e1f3d8;
}
.bg-orange
{
  background-color: #faecd8;
}
.bg-red
{
  background-color: #fde2e2;
}
.bg-blue
{
  background-color: #d9ecff;
}
.el-menu {
  border-right: none !important;
}
.el-submenu {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.el-submenu:first-child {
  border-top: none;
}
.el-submenu [class^="el-icon-"] {
  vertical-align: -1px !important;
}
a {
  color: #409eff;
  text-decoration: none;
}
.el-pagination {
  text-align: center;
  margin-top: 20px;
}
.el-popper__arrow {
  display: none;
}
</style>
