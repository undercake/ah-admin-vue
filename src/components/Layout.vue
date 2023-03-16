<template>
  <el-container class="container" :class="state.bg">
    <Sider />
    <el-container class="content">
      <Header @changebg="changeBg" />
      <div class="main">
        <slot v-if="!state.showErr" />
      </div>
    </el-container>
  </el-container>
</template>
<script setup>
import { onMounted, reactive, getCurrentInstance } from "vue";
import Header from "./Header.vue";
import { useRouter } from "vue-router";
import Sider from "./Sider.vue";
import { localSet, localGet } from "../utils";

const { currentRoute } = useRouter();
const state = reactive({
  showErr: false,
  bg: "bg-white",
  path: ""
});

const changeBg = (e) => {
  state.bg = e;
  localSet("bg", e);
};

// 布局初始化
onMounted(() => {
  state.path = currentRoute._rawValue.path;
  state.bg = localGet("bg", "bg-white");
  console.log(state.path);
});
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
  height: calc(100vh - 100px);
  overflow: auto;
  padding: 10px;
}
</style>
<style>
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
</style>
