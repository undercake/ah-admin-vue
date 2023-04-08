<template>
  <Layout>
    <el-card class="category-container" v-if="state.allLoading">
      <el-skeleton :rows="8" animated />
    </el-card>
    <el-card class="account-container" v-if="!state.allLoading">
      <el-form
        :model="state.nameForm"
        :rules="rules1"
        ref="nameRef"
        label-width="100px"
        label-position="right"
        class="demo-ruleForm"
      >
        <el-form-item label="昵称：" prop="full_name">
          <el-input v-model="state.nameForm.full_name" />
        </el-form-item>
        <el-form-item label="登录名：" prop="user_name">
          <el-input v-model="state.nameForm.user_name" />
        </el-form-item>
        <el-form-item label="手机号：" prop="mobile">
          <el-input v-model="state.nameForm.mobile" />
        </el-form-item>
        <el-form-item label="电子邮箱：" prop="email">
          <el-input v-model="state.nameForm.email" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitName"
            :disabled="state.nameLoading"
            :loading="state.nameLoading"
          >
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="account-container" v-if="!state.allLoading">
      <el-form
        :model="state.passForm"
        :rules="rules2"
        ref="passRef"
        label-width="100px"
        label-position="right"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码：" prop="oldpass">
          <el-input v-model="state.passForm.oldpass" />
        </el-form-item>
        <el-form-item label="新密码：" prop="newpass">
          <el-input v-model="state.passForm.newpass" />
        </el-form-item>
        <el-form-item label="重复密码：" prop="newpass_repeat">
          <el-input v-model="state.passForm.newpass_repeat" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="danger"
            @click="submitPass"
            :disabled="state.passLoading"
            :loading="state.passLoading"
          >
            确认修改
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </Layout>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";
import md5 from "js-md5";

const nameRef = ref();
const passRef = ref();
const { urls, req, showMsg } =
  getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
  user: null,
  allLoading: true,
  nameLoading: false,
  nameForm: {
    full_name: "",
    user_name: "",
    mobile: "",
    email: "",
  },
  passLoading: false,
  passForm: {
    oldpass: "",
    newpass: "",
    newpass_repeat: "",
  },
});

const rules1 = {
  full_name: [{ required: "true", message: "姓名不能为空", trigger: ["blur"] }],
  user_name: [
    { required: "true", message: "登录名不能为空", trigger: ["blur"] },
  ],
  mobile: [
    { len: 11, message: "请输入正确的手机号", trigger: "blur" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号码格式不正确",
      trigger: "blur",
    },
  ],
  email: [
    {
      pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: "邮箱格式不正确",
      trigger: "blur",
    },
  ],
};
const rules2 = {
  oldpass: [
    { required: "true", message: "原密码不能为空", trigger: ["change"] },
  ],
  newpass: [
    { required: "true", message: "新密码不能为空", trigger: ["blur"] },
    { min: 6, message: "新密码不能小于6位", trigger: ["blur"] },
  ],
  newpass_repeat: [
    { required: "true", message: "重复密码不能为空", trigger: ["blur"] },
    {
      validator: (r, v, c) =>
        state.passForm.newpass !== v
          ? c(new Error("两次输入的密码不一致"))
          : c(),
      message: "两次密码不一致",
      trigger: ["blur"],
    },
  ],
};
onMounted(() => {
  getData();
});

const getData = () => {
  req.get(urls.my_get, (d) => {
    state.nameForm = d.data;
    state.allLoading = false;
    state.passForm = {
      oldpass: "",
      newpass: "",
      newpass_repeat: "",
    };
  });
};
const submitCore = (ref, loadingName, url, data) => {
  ref.value.validate((vaild) => {
    if (!vaild) {
      for (const k in err) {
        showMsg.err(err[k][0].message);
        break;
      }
      return;
    }
    state[loadingName] = true;
    req.post(
      url,
      data,
      (d) => {
        showMsg.succ("提交成功");
        getData();
        state[loadingName] = false;
      },
      (e) => (state[loadingName] = false)
    );
  });
};
const submitName = () => {
  const { full_name, user_name, mobile, email } = state.nameForm;
  submitCore(nameRef, "nameLoading", urls.my_set, {
    full_name,
    user_name,
    mobile,
    email,
  });
};
const submitPass = () => {
  const { oldpass, newpass, newpass_repeat } = state.passForm;
  submitCore(passRef, "passLoading", urls.my_set_pass, {
    oldpass: md5(oldpass),
    newpass: md5(newpass),
    newpass_repeat: md5(newpass_repeat),
  });
};
</script>

<style scoped>
.el-input {
  width: 16rem;
}
</style>

<style>
.account-container {
  margin-bottom: 20px;
}
</style>
