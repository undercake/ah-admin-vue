<template>
  <Layout>
    <el-card class="account-container">
      <el-form
        :model="state.nameForm"
        :rules="state.rules1"
        ref="nameRef"
        label-width="80px"
        label-position="right"
        class="demo-ruleForm"
      >
        <el-form-item label="登录名：" prop="full_name">
          <el-input
            style="width: 200px"
            v-model="state.nameForm.full_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称：" prop="user_name">
          <el-input
            style="width: 200px"
            v-model="state.nameForm.user_name"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录名：" prop="mobile">
          <el-input
            style="width: 200px"
            v-model="state.nameForm.mobile"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称：" prop="email">
          <el-input
            style="width: 200px"
            v-model="state.nameForm.email"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitName">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="account-container">
      <el-form
        :model="state.passForm"
        :rules="state.rules2"
        ref="passRef"
        label-width="80px"
        label-position="right"
        class="demo-ruleForm"
      >
        <el-form-item label="原密码：" prop="oldpass">
          <el-input
            style="width: 200px"
            v-model="state.passForm.oldpass"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newpass">
          <el-input
            style="width: 200px"
            v-model="state.passForm.newpass"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitPass">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </Layout>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";
import md5 from "js-md5";

const nameRef = ref(null);
const passRef = ref(null);
const { urls, req, showMsg } =
  getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
  user: null,
  nameForm: {
    full_name: "",
    user_name: "",
    mobile: "",
    email: "",
  },
  passForm: {
    oldpass: "",
    newpass: "",
  },
  rules1: {
    full_name: [
      { required: "true", message: "登录名不能为空", trigger: ["change"] },
    ],
    user_name: [
      { required: "true", message: "昵称不能为空", trigger: ["change"] },
    ],
    mobile: [
      { message: "", trigger: ["change"] },
    ],
    email: [
      { message: "", trigger: ["change"] },
    ],
  },
  rules2: {
    oldpass: [
      { required: "true", message: "登录名不能为空", trigger: ["change"] },
    ],
    newpass: [
      { required: "true", message: "昵称不能为空", trigger: ["change"] },
    ]
  },
});
onMounted(() => {});

const getData = () => {
  req.get(urls.my_get, d=>{

  })
};
const submitName = () => {
  nameRef.value.validate((vaild) => {
    if (vaild) {
    }
  });
};
const submitPass = () => {
  passRef.value.validate((vaild) => {
    if (vaild) {
    }
  });
};
</script>

<style>
.account-container {
  margin-bottom: 20px;
}
</style>
