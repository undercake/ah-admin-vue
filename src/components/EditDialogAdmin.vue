<template>
  <el-dialog
    v-model="state.is_edit"
    :title="state.id == 0 ? '添加管理员' : '编辑管理员'"
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
      <el-form-item label="姓名" prop="full_name">
        <el-input type="text" v-model="state.ruleForm.full_name"></el-input>
      </el-form-item>
      <el-form-item label="登录名" prop="user_name">
        <el-input type="text" v-model="state.ruleForm.user_name"></el-input>
      </el-form-item>
      <el-form-item
        v-loading="state.group_load"
        label="用户组"
        prop="user_group"
      >
        <el-select
          v-model="state.ruleForm.user_group"
          class="m-2"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in state.group_list"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          /> </el-select
      ></el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input type="text" v-model="state.ruleForm.mobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="text" v-model="state.ruleForm.email"></el-input>
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
import { ElMessageBox } from "element-plus";

const { urls, req, showMsg, hasRights } = getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits();
const formRef = ref(null);
const state = reactive({
  id           : -1,
  is_edit      : false,
  group_load   : false,
  load_all     : false,
  disable_close: false,
  group_list   : [],
  ruleForm     : {
    full_name : "",
    user_name : "",
    user_group: '',
    mobile    : '',
    email     : ''
  },
  rules: {
    full_name: [
      { required: "true", message: "姓名不能为空", trigger: ["blur"] },
    ],
    user_name: [
      { required: "true", message: "登录名不能为空", trigger: ["blur"] },
    ],
    mobile: [
      { len: 11, message: "请输入正确的手机号", trigger: "blur" },
      { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
    ],
    email: [
      { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '邮箱格式不正确', trigger: 'blur' }
    ]
  },
});

const open = (id = 0) => {
  console.log(hasRights('/admin/edit'));
  if (!hasRights('/admin/edit')) return showMsg.err('您没有权限编辑此项目');
  if (state.group_list.length < 1) get_group();
  if (id === state.id) return state.is_edit = true;
  if (id === 0 ) {state.id = 0;return state.is_edit = true;}
  if (id > 0) {
    state.id = id;
    get_user_info();
    state.is_edit = true;
  }
};

const close = () => (state.is_edit = false);

const get_user_info = ()=>{
  state.load_all = true;
  const id = state.id;
  req.get(`${urls.admin_detail}/id/${id}`, ({detail})=>{
    state.ruleForm.full_name  = detail.full_name;
    state.ruleForm.user_name  = detail.user_name;
    state.ruleForm.user_group = detail.user_group;
    state.ruleForm.mobile     = detail.mobile;
    state.load_all   = false;
  });
}

const get_group = ()=>{
  state.group_load = true;
  req.get(urls.group_list_all, d=>{
    state.group_list = d.grp;
    state.group_load = false;
  })
}

const submit_form = async () => {
  formRef.value.validate((valid, err) => {
    if (!valid) {
      for (const k in err) {
        showMsg.err(err[k][0].message);
        break;
      }
      return;
    }
    const {full_name, user_name, user_group, email, mobile} = state.ruleForm;
    const url    = state.id == 0 ? urls.admin_add : urls.admin_alter;
    const method = state.id == 0 ? 'post' : 'put';
    req[method](
          (url),
          {full_name, user_name, user_group, email, mobile, id: state.id},
          d=>{
            showMsg.succ('提交成功！');
            if (state.id === 0)
              ElMessageBox.alert('请在“修改管理员密码”页面修改此管理员的密码！', '提示', {
                confirmButtonText: '确定'
              });
            state.is_edit       = false;
            state.disable_close = false;
            state.ruleForm      = {
              full_name : "",
              user_name : "",
              user_group: '',
              mobile    : '',
              email     : ''
            }
            state.id = -1;
            emit('reload', true);
          },
          e=>{
            console.warn(e);
            state.disable_close = false;
          }
      )
  })
}

defineExpose({ open, close });
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
