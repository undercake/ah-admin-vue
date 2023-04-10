<template>
  <el-card>
    <el-result icon="warning" :title="msg[code]">
      <template #extra>
        <el-button type="primary" @click="handleBack">返回</el-button>
      </template>
    </el-result>
  </el-card>
</template>

<script setup>
// import {onMounted, ref} from 'vue';
const msg = {
  404: "您请求的资源不存在",
  403: "您没有权限访问",
};
const props = defineProps(["code"]);
const code = props["code"];
const handleBack = () => navigation.back();
</script>
<style scoped></style>
