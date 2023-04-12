<template>
  <el-dialog
    :model-value="true"
    width="40%"
    center
    :close-on-click-modal="false"
    :show-close="false"
  >
    <template #header>
      <span role="heading" class="el-dialog__title">编辑选项</span>
      <button aria-label="el.dialog.close" class="el-dialog__headerbtn" type="button" :disabled="state.disable_close" @click="handleClose">
        <i class="el-icon el-dialog__close fa-solid fa-xmark-large fa-fw" />
      </button>
    </template>
    <el-skeleton :rows="3" animated v-if="state.firstLoading" />
    <div class="serv-opt-scro" v-if="!state.firstLoading">
      <el-scrollbar>
        <el-card v-for="(o, i) in state.ruleForm" :key="i">
          <serv-opts
            :rules="rules"
            :index="i"
            @delete="handleDelete(i)"
            @change="handleChange(i)"
            v-model="state.ruleForm[i]"
            :disabled="state.disable_close"
          />
        </el-card>
        <el-card>
          <div class="text-center text-plus" @click="handleAdd">
            <i class="fa-solid fa-plus"></i>
          </div>
        </el-card>
      </el-scrollbar>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          @click="handleClose"
          :disabled="state.disable_close"
          type="primary"
        >
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, getCurrentInstance, onMounted } from "vue";
import ServOpts from "./ServOpts.vue";

const { urls, req, showMsg } =
  getCurrentInstance().appContext.config.globalProperties;

const emit = defineEmits(['close']);
const props = defineProps(['id']);
const state = reactive({
  id: -1,
  emp_load: true,
  disable_close: false,
  firstLoading: true,
  ruleForm: [
    {
      formRef: null,
      name: "",
      price_intro: "",
      min_num: "",
      wai_num: "",
      image: "",
      deleted: 0,
    },
  ]
});
const rules = {
  name: [{ required: "true", message: "服务名称不能为空", trigger: ["blur"] }],
  intro: [{ required: "true", message: "简介不能为空", trigger: ["blur"] }],
};
// 获取初始信息
const get_service_opt = () => {
  state.firstLoading = false;
  state.emp_load = true;
  const id = state.id;
  req.get(`${urls.services_options}/id/${id}`, ({ data }) => {
    state.ruleForm = [...data];
    state.ruleForm.forEach((e, i) => {
      state.ruleForm[i] = { ...e, formRef: false };
    });
    state.emp_load = false;
    console.log(state.ruleForm);
  }, e=>{
    console.log(e);
    emit("closed", true);
  });
  req.get(
    `${urls.services_options}/id/${id}`,
    ({ data }) => (state.options = data)
  );
};

onMounted(() => {
  state.id = props['id'];
  console.log(state);
  get_service_opt();
});

const handleClose = e => {
  emit('close', true);
}

const handleAdd = () => {
  console.log(state.ruleForm);
  state.ruleForm.push({
    id: 0,
    name: "",
    price_intro: "",
    min_num: "",
    wai_num: "",
    image: "",
    deleted: 0,
    formRef: false,
    edit: false
  });
};

const handleDelete = (index) => {
  status_loading(true);
  const data = state.ruleForm[index];
  console.log(data);
  if (data.id == 0)
    state.ruleForm = state.ruleForm.filter((e, i) => index !== i);
  else req.del(urls.services_opt_del + '/id/' + data.id, (d) => {
    get_service_opt();
    showMsg.succ('操作成功');
      status_loading(false);
  }, e=> status_loading(false));
};

const status_loading = e => {
  if (e === false) return setTimeout(() => {
    state.disable_close = e;
    state.emp_load = e
  }, 500);
  state.disable_close = e;
  state.emp_load = e
}

const handleChange = (i) => {
  state.ruleForm[i].edit = true;
  status_loading(true);
  const { id, name, price_intro, min_num, wai_num, image, deleted, formRef } =
    state.ruleForm[i];
  const url = id == 0 ? urls.services_opt_add : urls.services_opt_edit;
  req.put(
    url,
    {
      id: id == 0 ? state.id : id,
      name,
      price_intro,
      min_num,
      wai_num,
      image,
      deleted,
      formRef,
    },
    (d) => {
      get_service_opt();
      status_loading(false);
      showMsg.succ('操作成功');
    },
    (e) => {
      state.ruleForm[i].edit = false;
      status_loading(false);
    }
  );
};
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.el-card {
  margin-top: 0.9rem;
}
.el-row {
  border-top: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}
.el-col {
  border: 1px solid #dcdfe6;
  border-top: none;
  border-left: none;
}
.el-card span {
  margin-right: 1rem;
  line-height: 2rem;
}
.el-card span.right {
  margin-right: 0;
  float: right;
}
img.avatar {
  width: 80px;
  height: 80px;
}
img.img {
  width: 280px;
  height: 280px;
}
.serv-opt-scro {
  height: 400px;
  border: solid 1px var(--el-color-info-light-5);
  padding: 0.4rem;
  border-radius: 5px;
  /* box-shadow: 0 0 rgba(0, 0, 0, 0.12), 0 0 0 rgba(14, 20, 25, 0.12),
    inset -2px -2px 10px rgba(14, 20, 25, 0.12),
    inset 2px 2px 10px rgba(0, 0, 0, 0.12); */
}
.el-dialog__headerbtn:hover {
  color: var(--el-color-primary-light-3);
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar-uploader .fa.fa-regular.fa-plus-large {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar-uploader img {
  width: 150px;
}
.text-plus {
  cursor: pointer;
  text-align: center;
  font-size: 2rem;
  line-height: 4rem;
  color: var(--el-color-primary-dark-2);
  border: var(--el-color-primary-dark-2) dotted 1px;
}
.text-plus:hover {
  color: var(--el-color-primary-light-3);
  border-color: var(--el-color-primary-light-3);
}
</style>
