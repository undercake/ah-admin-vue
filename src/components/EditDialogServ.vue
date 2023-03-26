<template>
  <el-dialog
    v-model="state.is_edit"
    :title="state.edit_id == 0 ? '添加服务' : '编辑服务'"
    width="30%"
    center
    :close-on-click-modal="false"
    :show-close="!state.disable_close"
  >
    <el-skeleton :rows="3" animated v-if="state.emp_load" />
    <el-form
      :model="state.ruleForm"
      :rules="state.rules"
      ref="formRef"
      label-width="100px"
      class="good-form"
      v-if="!state.emp_load"
    >
      <el-form-item label="头像" prop="avatar">
        <el-upload
          class="avatar-uploader"
          :action="urls.upload_public"
          :show-file-list="false"
          :on-success="
            (...e) => {
              handleUploadSuccess('avatar', ...e);
            }
          "
          :before-upload="
            (...e) => {
              beforeUpload('avatar', ...e);
            }
          "
          accept="image/*"
        >
          <img
            v-if="state.avatar != ''"
            :src="state.ruleForm.avatar"
            class="avatar"
          />
          <i v-else class="fa fa-regular fa-plus-large" />
        </el-upload>
      </el-form-item>
      <el-form-item label="服务名称" prop="name">
        <el-input
          type="text"
          @input="name_change"
          v-model="state.ruleForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="服务简介" prop="intro">
        <el-input
          v-model="state.ruleForm.intro"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
          placeholder="服务简介"
        />
      </el-form-item>
      <el-form-item label="温馨提示" prop="prompt">
        <el-input type="text" v-model="state.ruleForm.prompt"></el-input>
      </el-form-item>
      <el-form-item label="上架状态" prop="status">
        <el-select
          v-model="state.ruleForm.status"
          class="m-2"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="(item,ind) in ['下架', '上架']"
            :key="ind"
            :label="item"
            :value="ind"
          />
        </el-select>
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
onMounted(() => {});

const formRef = ref(null);
const state = reactive({
  id           : -1,
  is_edit      : false,
  emp_load     : false,
  load_all     : false,
  disable_close: false,
  emp_list     : [],
  options:[
    // {id, name, image, service_id, price, price_intro, min_num, wai_num, deleted}
  ],
  ruleForm     : {
    avatar: "",
    name  : "",
    intro : "",
    prompt: "",
    status: ""
  },
  rights_selected: new Set([]),
  rules: {
    name: [{ required: "true", message: "服务名称不能为空", trigger: ["blur"] }],
    intro: [{ required: "true", message: "简介不能为空", trigger: ["blur"] }]
  },
});

// 开启编辑窗口
const open = (id = 0) => {
  console.log(hasRights("/services/edit"));
  if (!hasRights("/services/edit")) return showMsg.err("您没有权限编辑此项目");
  state.is_edit = true;
  if (id === state.id) return (state.is_edit = true);
  if (id === 0) return (state.is_edit = true);
  if (id > 0) {
    state.id = id;
    get_service_info();
  }
};

const close = () => (state.is_edit = false);

// 获取初始信息
const get_service_info = () => {
  state.load_all = true;
  const id = state.id;
  req.get(`${urls.services_detail}/id/${id}`, ({ detail }) => {
    detail;
    const { birth_date, work_date } = detail;
    state.ruleForm = { ...detail };
    console.log({ birth_date, work_date });
    state.ruleForm.birth_date = birth_date == "0000-00-00" ? "" : birth_date;
    state.ruleForm.work_date = work_date == "0000-00-00" ? "" : work_date;
    state.rights_selected.clear();
    console.log(detail, state.rights_selected);
    state.load_all = false;
  });
  req.get(`${urls.services_options}/id/${id}`, ({ data }) => state.options = data)
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
    const {
      avatar,
      name,
      phone,
      address,
      intro,
      gender,
      id_code,
      pinyin,
      pym,
      birth_date,
      work_date,
      grade,
      origin,
      workee,
      note,
    } = state.ruleForm;
    const id = state.id;
    const url = state.id == 0 ? urls.employee_add : urls.employee_alter;
    const method = state.id == 0 ? "post" : "put";
    // return console.log({name,phone,address,intro,gender,id_code,pinyin,pym,birth_date,work_date,grade,id});
    req[method](
      url,
      {
        avatar,
        name,
        phone,
        address,
        intro,
        gender,
        id_code,
        pinyin,
        pym,
        birth_date,
        work_date,
        grade,
        id,
        origin,
        workee,
        note,
      },
      (d) => {
        state.is_edit = false;
        state.disable_close = false;
        state.ruleForm = {
          name: "",
        };
        state.rights_selected.clear();
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

const handleUploadSuccess = (type, response, uploadFile) => {
  console.log("res", response);
  if (response.code == 0) state.ruleForm[type] = response.path;
  else showMsg.err(response.message);
  console.log("upload", uploadFile);
};

const beforeUpload = (type, rawFile) => {
  let res = true;
  const allowType = ["image/jpeg", "image/png"];
  const fileSize = rawFile.size / 1024;
  console.log(type, rawFile, fileSize);
  if (!allowType.includes(rawFile.type)) {
    showMsg.err("文件格式不正确，必须为jpg或者png格式");
    console.log(-1);
    return new Promise().reject();
  }
  if (type == "avatar" && fileSize > 300) {
    showMsg.err("头像不能大于300K");
    console.log(-2);
    return new Promise().reject();
  }
  if (fileSize / 1024 > 2) {
    showMsg.err("图片不能大于2M");
    console.log(-3);
    return new Promise().reject();
  }
  return res;
};

defineExpose({ open, close });
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

.avatar-uploader .fa.fa-regular.fa-plus-large {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
</style>
