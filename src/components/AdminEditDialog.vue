<template>
  <el-dialog
    v-model="state.is_edit"
    :title="state.edit_id == 0 ? '添加管理员' : '编辑管理员'"
    width="30%"
    center
    :close-on-click-modal="false"
  >
    <el-form
      :model="state.ruleForm"
      :rules="state.rules"
      ref="formRef"
      label-width="100px"
      class="good-form"
    >
      <el-form-item label="姓名" prop="full_name">
        <el-input type="text" v-model="state.ruleForm.full_name"></el-input>
      </el-form-item>
      <el-form-item label="登录名" prop="user_name">
        <el-input type="text" v-model="state.ruleForm.user_name"></el-input>
      </el-form-item>
      <el-form-item label="用户组" prop="user_group">
        <el-select
          v-model="value"
          class="m-2"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          /> </el-select
      ></el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">Cancel</el-button>
        <el-button type="primary" @click="close"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, onMounted, getCurrentInstance } from "vue";

const { urls, req } = getCurrentInstance().appContext.config.globalProperties;
const props = defineProps(["reload"]);
onMounted(() => {
  console.log("edit Start");
});

const state = reactive({
  is_edit: false,
  edit_id: 0,
  group_list:[],
  ruleForm: {
    full_name: "",
    user_name: "",
  },
  rules: {
    full_name: [
      { required: "true", message: "姓名不能为空", trigger: ["blur"] },
    ],
    user_name: [
      { required: "true", message: "登录名不能为空", trigger: ["blur"] },
    ],
  },
});

get_group = ()=>{
  req.get(urls.group_list_all, d=>{
    state.group_list = d.grp;
  })
}

const close = () => (state.is_edit = false);

const open = (id = 0) => {
  if (!group_list) get_group();
  state.id = id;
  state.is_edit = true;
};
defineExpose({ open, close });
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
