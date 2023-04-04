<template>
  <div class="layout" v-cloak>
    <router-view />
  </div>
  <el-empty class="v-cloak-c" description="加载中..." />
</template>

<script setup>
import { onMounted, onUnmounted, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { localSet } from "@/utils";
import axios from "axios";
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark({
  selector: "body",
  attribute: "color-scheme",
  valueDark: "dark",
  valueLight: "light",
  onChanged(dark) {
    dark
      ? document.querySelector("html").classList.add("dark")
      : document.querySelector("html").classList.remove("dark");
    localSet("bg", dark ? 'bg-dark' : '');
  },
});
const toggleDark = useToggle(isDark);

const router = useRouter();

const { urls, mittBus } =
  getCurrentInstance().appContext.config.globalProperties;

onMounted(() => {
  mittBus.on("dark-mode", toggleDark);
  axios
    .get(urls.isLogged)
    .then(({ data }) => {
      const path = router.currentRoute._rawValue.path;
      if (!data.is_login) {
        if (path != "/index" && path != "/login") localSet("beforeLoin", path);
        router.push({ path: "/login" });
      } else if (path == "/login") router.push({ path: "/" });
    })
    .catch((e) => console.log(e));
});
onUnmounted(() => mittBus.off("dark-mode"));
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: #ffffff;
}
.dark .layout {
  background-color: #212121;
}
</style>

<style>
body {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font: 14px Helvetica Neue, Helvetica, PingFang SC, Tahoma, Arial, sans-serif;
}

.bg-green .el-card,
.bg-orange .el-card,
.bg-red .el-card,
.bg-blue .el-card {
  background: rgba(255, 255, 255, 0.7);
}

.bg-green {
  background-color: #e1f3d8;
}
.bg-orange {
  background-color: #faecd8;
}
.bg-red {
  background-color: #fde2e2;
}
.bg-blue {
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
[v-cloak] {
  display: none;
}
[v-cloak] + .v-cloak-c {
  display: flex;
}
.v-cloak-c {
  display: none;
}
</style>
