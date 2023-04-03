<template>
  <Layout>
    <el-card class="category-container" v-if="state.firstLoading">
      <el-skeleton :rows="8" animated />
    </el-card>
    <el-card class="account-container" v-if="!state.firstLoading" v-loading="state.loading">
      <el-form
        :model="state.passForm"
        :rules="state.rules"
        ref="nameRef"
        label-width="100px"
        label-position="right"
        class="demo-ruleForm"
      >
        <el-form-item label="管理员：" prop="user_id">
          <el-select v-model="state.passForm.user_id" clearable placeholder="选择管理员">
            <el-option
              v-for="item in state.user_data"
              :key="item.id"
              :label="'姓名：' + item.full_name + ' 登录名：' + item.user_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密码：" prop="newpass">
          <el-input
            style="width: 300px"
            v-model="state.passForm.newpass"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="重复密码：" prop="newpass_repeat">
          <el-input
            style="width: 300px"
            v-model="state.passForm.newpass_repeat"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitName">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </Layout>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import { ElMessage } from "element-plus";
import Layout from "@/components/Layout.vue";
import md5 from "js-md5";

const nameRef = ref(null);
const {urls, req, showMsg} = getCurrentInstance().appContext.config.globalProperties;
const rpt_pass = (rule, value, callback) => {
      if (state.passForm.newpass !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    }
const state = reactive({
  user: null,
  user_data:[],
  passForm: {
    user_id: '',
    newpass: '',
    newpass_repeat:''
  },
  rules: {
    newpass: [
      { required: "true", message: '新密码不能为空', trigger: ["blur"] },
      { min: 6, message: '新密码不能小于6位', trigger: ["blur"] },
    ],
    newpass_repeat: [
      { required: "true", message: '重复密码不能为空', trigger: ["blur"] },
      { validator: rpt_pass, message: '两次密码不一致', trigger: ["blur"] },
    ],
  },
});
const get_data = ()=>{
  state.loading = true;
  req.get(urls.admin_all, d=>{
    state.firstLoading = false;
    state.user_data = d.data;
    state.loading = false;
  }, ()=>state.firstLoading = false)
}
onMounted(() => {
  get_data();
});
const submitName = () => {
  nameRef.value.validate((vaild) => {
    if (!vaild) {
      for (const k in err) {
        showMsg.err(err[k][0].message);
        break;
      }
      return;
    }
    const {user_id, newpass} = state.passForm;
    req.post(urls.admin_pass,{id: user_id, pass: md5(newpass)}, d=>{
      showMsg.succ('提交成功！');
      state.passForm.user_id = '';
      state.passForm.newpass = '';
      state.passForm.newpass_repeat = '';
    });
  });
};
</script>

<style scoped>
.account-container {
  margin-bottom: 20px;
}
.el-select {
  width: 300px;
}
</style>
