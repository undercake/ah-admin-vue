<template>
  <el-dialog
    :model-value="state.is_edit"
    width="40%"
    center
    :close-on-click-modal="false"
    :show-close="false"
    v-loading="state.emp_load"
  >
    <template #header>
      <span role="heading" class="el-dialog__title"
        >{{ state.id == 0 ? "添加" : "编辑" }}服务</span
      >
      <button
        class="el-dialog__headerbtn"
        type="button"
        :disabled="state.disable_close"
        @click="handleClose"
      >
        <i class="el-icon el-dialog__close fa-solid fa-xmark-large fa-fw" />
      </button>
    </template>
    <el-skeleton :rows="3" animated v-if="state.emp_load" />
    <el-form
      :model="state.ruleForm"
      :rules="rules"
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
        <el-input type="text" v-model="state.ruleForm.name"></el-input>
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
      <el-form-item label="服务类目" prop="class_id">
        <el-select
          v-model="state.ruleForm.class_id"
          class="m-2"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="item in state.category"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上架状态" prop="status">
        <el-select
          v-model="state.ruleForm.status"
          class="m-2"
          placeholder="Select"
          size="large"
        >
          <el-option
            v-for="(item, ind) in ['下架', '上架']"
            :key="ind"
            :label="item"
            :value="ind"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="轮播图" prop="banner">
        <el-upload
          action="#"
          list-type="picture-card"
          accept="image/jpeg,image/png"
          v-model:file-list="state.ruleForm.banner"
          :disabled="state.uploading"
          :auto-upload="false"
        >
          <i class="fa-solid fa-plus el-icon" />

          <template #file="{ file }">
            <div>
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              />
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="fa-regular fa-magnifying-glass-plus el-icon" />
                </span>
                <span
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="fa-solid fa-trash-can el-icon" />
                </span>
              </span>
            </div>
          </template>
        </el-upload>
      </el-form-item>
      <el-form-item label="详细信息" prop="details">
        <div style="border: 1px solid #ccc; border-radius: 5px; padding: 2px 0">
          <div v-if="state.progress > 0">
            <el-progress :percentage="state.progress" />
          </div>
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            ref="toolbar_ref"
            :editor="editorRef"
            :mode="mode"
            :defaultConfig="editBarConf"
          />
          <Editor
            style="overflow-y: hidden"
            ref="editor_ref"
            v-model="state.ruleForm.details"
            :mode="mode"
            @onCreated="handleCreated"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" :disabled="state.disable_close"
          >取消</el-button
        >
        <el-button
          type="primary"
          @click="submit_form"
          :disabled="state.disable_close"
          :loading="state.uploading"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog v-model="state.dialogVisible">
    <img w-full :src="state.dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<script setup>
import {
  reactive,
  onUnmounted,
  onMounted,
  getCurrentInstance,
  ref,
  shallowRef,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";

const { urls, req, showMsg, hasRights } =
  getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits(["closed", "reload"]);
const props = defineProps(["id"]);

const mode = "simple";
const formRef = ref(null);
const editorRef = shallowRef();
const state = reactive({
  progress: 0,
  dialogVisible: false,
  dialogImageUrl: "",
  uploading: false,
  id: -1,
  is_edit: false,
  emp_load: false,
  load_all: false,
  disable_close: false,
  emp_list: [],
  category: [],
  ruleForm: {
    avatar: "",
    name: "",
    intro: "",
    prompt: "",
    status: "",
    class_id: "",
  },
});

const rules = {
  name: [{ required: "true", message: "服务名称不能为空", trigger: ["blur"] }],
  intro: [{ required: "true", message: "简介不能为空", trigger: ["blur"] }],
};

const toolbar_ref = ref();
const editor_ref = ref();
const editBarConf = {
  excludeKeys: ["codeBlock", "fullScreen", "todo"],
  MENU_CONF: {
    uploadImage: {
      server: urls.upload_public,
      fieldName: "file",
      maxFileSize: 1 * 1024 * 1024,
      maxNumberOfFiles: 1,
      allowedFileTypes: ["image/jpeg", "image/png"],
      onProgress(p) {
        if (p >= 100) p = 0;
        state.progress = p;
      },
      async customUpload(res, insertFn) {
        const { path } = res;
        const pathName = path.split("/");
        insertFn(path, pathName[pathName.length - 1], path);
      },
    },
  },
};

const handleClose = (e) => {
  state.is_edit = false;
  emit("closed", e);
};

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};

const handleRemove = (e) => {
  console.log(e);
  state.ruleForm.banner = state.ruleForm.banner.filter((d) => d.uid !== e.uid);
};

onMounted(() => {
  state.is_edit = true;
  state.id = props["id"];
  console.log(state);
  get_service_info();
});

onUnmounted(() => {
  console.log("des serv");
  editorRef.value && editorRef.value.destroy();
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
  }
};

// 获取初始信息
const get_service_info = () => {
  state.load_all = true;
  const id = state.id;
  req.get(`${urls.services_detail}/id/${id}`, ({ detail }) => {
    const {
      avatar,
      banner,
      class_id,
      details,
      id,
      intro,
      name,
      prompt,
      status,
    } = detail;
    state.ruleForm = {
      avatar,
      banner: banner.split(",").map((url) => {
        return { url };
      }),
      class_id,
      details,
      id,
      intro,
      name,
      prompt,
      status,
    };
    state.load_all = false;
    console.log(state.ruleForm);
  });
  req.get(urls.services_category, ({ data }) => (state.category = data));
};

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

const setPath = (uid, path) =>
  state.ruleForm.banner.forEach((d, i) => {
    if (d.uid == uid)
      state.ruleForm.banner[i] = { status: "success", uid, url: path };
  });

const submit_form = async () => {
  state.uploading = true;
  console.log(toolbar_ref);
  console.log(toolbar_ref.value.editor.getConfig());
  // toolbar.getConfig();
  console.log(editor_ref);
  Promise.all(
    state.ruleForm.banner
      .filter((e) => e.status == "ready")
      .map(
        (e) =>
          new Promise((resolve, reject) => {
            req.upload(
              urls.upload_public,
              e.raw ,
              (p) => (state.progress = p),
              (u) => {
                setPath(e.uid, u.path);
                resolve([u, e]);
              },
              reject
            );
          })
      )
  )
    .then((e) => {console.log('t',e); state.uploading = false;state.progress = 0})
    .catch((e) => {console.log('c',e); state.uploading = false;state.progress = 0});
  return console.log(state.ruleForm);
  formRef.value.validate((valid, err) => {
    if (!valid) {
      for (const k in err) {
        showMsg.err(err[k][0].message);
        break;
      }
      return;
    }
    const { avatar, banner, class_id, details, intro, name, prompt, status } =
      state.ruleForm;
    const id = state.id;
    const url = state.id == 0 ? urls.employee_add : urls.employee_alter;
    const method = state.id == 0 ? "post" : "put";
    // return console.log({name,phone,address,intro,gender,id_code,pinyin,pym,birth_date,work_date,grade,id});
    req[method](
      url,
      {
        avatar,
        banner: banner.toString(),
        class_id,
        details,
        id,
        intro,
        name,
        prompt,
        status,
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

// defineExpose({ open, close });
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
