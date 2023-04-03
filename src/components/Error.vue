<template>
  <div>
    
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
let code = ref(0);
const msg  = [];
// code = defineProps('code');

onMounted(() => {
  msg[404] = '资源没有找到';
  msg[503] = '您没有权限访问';
});
</script>
<style scoped></style>