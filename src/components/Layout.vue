<template>
  <el-container class="container" :class="state.bg">
    <Sider @change="" />
    <el-container class="content">
      <Header @changebg="changeBg" />
      <div class="main">
        <el-config-provider :locale="zhCn">
          <el-scrollbar>
            <Error :code="state.code" v-if="state.showErr"></Error>
            <slot v-if="!state.showErr && !state.route_loading" />
            <el-card class="category-container" v-if="state.route_loading">
              <el-skeleton :rows="8" animated />
            </el-card>
            <el-dialog
              :model-value="!state.is_login"
              title="登录"
              width="400px"
              center
              :close-on-click-modal="false"
            >
              <Login @login="to_log" v-if="!state.is_login" />
            </el-dialog>
          </el-scrollbar>
        </el-config-provider>
      </div>
    </el-container>
  </el-container>
</template>
<script setup>
import { onMounted, onUnmounted, reactive, getCurrentInstance } from "vue";
import Header from "./Header.vue";
import Login from "./Login.vue";
import { useRouter, createRouter } from "vue-router";
import Sider from "./Sider.vue";
import Error from "./Error.vue";
import { localSet, localGet } from "../utils";
import { ElConfigProvider } from 'element-plus'
import zhCn from'element-plus/lib/locale/lang/zh-cn'

const route = useRouter();
const { mittBus } = getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
  showErr: false,
  bg: "bg-white",
  path: "",
  is_login: true,
  route_loading:false,
  code: 0,
});

const changeBg = (e) => {
  state.bg = e;
  localSet("bg", e);
};

const to_log = () => {
  mittBus.emit("is_login", true);
  state.is_login = true;
};

// 布局初始化
onMounted(() => {
  state.path = route.currentRoute._rawValue.path;
  state.bg = localGet("bg", "bg-white");
  mittBus.on("is_login", (d) => {
    state.is_login = d;
  });
  mittBus.on('routChangeStart', ()=>{
    state.route_loading = true;
  });
});
onUnmounted(() => {
  mittBus.off("is_login");
});

// const router = createRouter()
// route.beforeEach(() => {
//   console.log('before');
//   state.route_loading = true;
//   mittBus.emit('routeChange', false);
// })
route.afterEach((to) => {
  console.log('after', to.fullPath);
  state.route_loading = false;
  mittBus.emit('routeChange', to.fullPath);
})
</script>
<style scoped>
.container {
  height: 100vh;
}
.content {
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow: hidden;
}
.main {
  height: 100vh;
  overflow: auto;
  padding: 10px;
}
</style>
<style>
.el-loading-mask {
  background-color: rgba(122, 122, 122, 0.8);
}
.bg-blue .el-loading-spinner .path {
  stroke: #d9ecff;
}
.bg-blue .el-loading-spinner .el-loading-text {
  color: #d9ecff;
}
.bg-orange .el-loading-spinner .path {
  stroke: #faecd8;
}
.bg-orange .el-loading-spinner .el-loading-text {
  color: #faecd8;
}
.bg-green .el-loading-spinner .path {
  stroke: #d1edc4;
}
.bg-green .el-loading-spinner .el-loading-text {
  color: #d1edc4;
}
.bg-red .el-loading-spinner .path {
  stroke: #fde2e2;
}
.bg-red .el-loading-spinner .el-loading-text {
  color: #fde2e2;
}
.bg-white .el-loading-spinner .path {
  stroke: #fff;
}
.bg-white .el-loading-spinner .el-loading-text {
  color: #fff;
}
/* .fa {
  padding-right: 0.5rem;
} */
.cell {
  text-align: center;
}
button i.fa{
  padding-right: .5rem;
}
</style>
