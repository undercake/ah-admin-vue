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
      v-loading="state.load_all"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input type="text" v-model="state.ruleForm.name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close" :disabled="state.disable_close"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="submit_form"
          :disabled="state.disable_close"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, onMounted, getCurrentInstance, ref } from "vue";

const { urls, req, showMsg, hasRights } =
  getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits();
onMounted(() => {
  console.log("edit Start");
});
const formRef = ref(null);
const state = reactive({
  id: -1,
  is_edit: false,
  group_load: false,
  load_all: false,
  disable_close: false,
  group_list: [],
  right_list: [],
  ruleForm: {
    name: "",
  },
  rights_selected: [],
  rules: {
    name: [{ required: "true", message: "角色名不能为空", trigger: ["blur"] }],
  },
});

const open = (id = 0) => {
  console.log(hasRights("/group/edit"));
  if (!hasRights("/group/edit")) return showMsg.err("您没有权限编辑此项目");
  if (state.group_list.length < 1) get_rights();
  if (id === state.id) return (state.is_edit = true);
  if (id === 0) return (state.is_edit = true);
  if (id > 0) {
    state.id = id;
    get_group_info();
    state.is_edit = true;
  }
};

const close = () => (state.is_edit = false);

const get_group_info = () => {
  state.load_all = true;
  const id = state.id;
  req.get(`${urls.group_detail}/id/${id}`, ({ detail }) => {
    state.ruleForm.name = detail.name;
    state.ruleForm.user_name = detail.user_name;
    state.ruleForm.user_group = detail.user_group;
    state.ruleForm.mobile = detail.mobile;
    state.load_all = false;
  });
};

const get_rights = () => {
  state.group_load = true;
  req.get(urls.rights_list, (d) => {
    const data = [];
    d.data.forEach((r) => {
      let children = [];
      const { id, parent, type, path, name } = r;
      if (parent !== 0) {
        if (!data[parent]){
            data[parent] = {
              ...d.data[parent],
              children: [{ id, parent, type, path, name, children:[] }],
            };
          } else {
            console.log(data,parent);
            console.log(!data[parent]);
            data[parent].children.push({ id, parent, type, path, name });
          }
      } else if (data[id] && data[id].children){
        children = data[id].children;
        data[id] = { id, parent, type, path, name, children };
      }
    });
    state.right_list = data;
    state.group_load = false;
    console.log(state.right_list);
  });
};

const submit_form = async () => {
  formRef.value.validate((valid, err) => {
    if (!valid) {
      for (const k in err) {
        showMsg.err(err[k][0].message);
        break;
      }
      return;
    }
    const { name, user_name, user_group, mobile } = state.ruleForm;
    const url = state.id == 0 ? urls.admin_add : urls.admin_alter;
    const method = state.id == 0 ? "post" : "put";
    req[method](
      url,
      { name, user_name, user_group, mobile, id: state.id },
      (d) => {
        state.is_edit = false;
        state.disable_close = false;
        state.ruleForm = {
          name: "",
          user_name: "",
          user_group: "",
          mobile: "",
        };
        state.id = -1;
        showMsg.succ("提交成功！");
        emit("reload", true);
      },
      (e) => {
        console.warn(e);
        state.disable_close = false;
      }
    );
  });
};

defineExpose({ open, close });
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>