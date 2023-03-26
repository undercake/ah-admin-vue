<template>
  <el-form
    :rules="props.rules"
    :ref="formRef"
    label-width="100px"
    class="good-form"
    :model="value"
    v-if="value"
  >
    <el-form-item label="名称" prop="name">
      <el-input type="text" v-model="value.name"></el-input>
    </el-form-item>
    <el-form-item label="价格" prop="price">
      <el-input
        v-model="value.price"
        :autosize="{ minRows: 2, maxRows: 4 }"
        type="number"
        placeholder="服务简介"
      />
    </el-form-item>
    <el-form-item label="价格说明" prop="price_intro">
      <el-input type="text" v-model="value.price_intro"></el-input>
    </el-form-item>
    <el-form-item label="最小购买数量" prop="min_num">
      <el-input type="number" v-model="value.min_num"></el-input>
    </el-form-item>
    <el-form-item label="服务者系数" prop="wai_num">
      <el-input type="number" v-model="value.wai_num"></el-input>
    </el-form-item>
    <el-form-item label="图片" prop="image">
      <el-upload
        class="avatar-uploader"
        :action="urls.upload_public"
        :show-file-list="false"
        :on-success="handleUploadSuccess"
        :before-upload="beforeUpload"
        accept="image/*"
      >
        <img v-if="value.image != ''" :src="value.image" class="image" />
        <i v-else class="fa fa-regular fa-plus-large"></i>
      </el-upload>
    </el-form-item>
    <div class="el-form-item asterisk-left opt_delete">
      <el-button
        type="primary"
        @click="handleChange"
        :disabled="props.disabled"
        :loading="value.edit"
      >
        提交更改
      </el-button>
      <el-popconfirm
        confirm-button-text="确定"
        cancel-button-text="取消"
        :icon="InfoFilled"
        icon-color="#626AEF"
        title="确定删除该项目吗？"
        @confirm="handleDelete"
      >
        <template #reference>
          <el-button type="danger" :disabled="props.disabled">
            删除项目
          </el-button>
        </template>
      </el-popconfirm>
    </div>
  </el-form>
</template>
<script setup>
import { computed, ref, getCurrentInstance, onMounted } from "vue";

const { urls, showMsg } =
  getCurrentInstance().appContext.config.globalProperties;

const props = defineProps(["modelValue", "rules", "index", "disabled"]);
const emit = defineEmits(["update:modelValue", "delete", "change"]);
const formRef = ref();

onMounted(() => console.log(props));

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const handleChange = (e) => {
  formRef.value?.validate((valid, err) => {
    if (!valid) {
      for (const k in err) {
        showMsg.err(err[k][0].message);
        break;
      }
    } else emit("change", e);
  });
};

// 删除
const handleDelete = (e) => emit("delete", e);

// 上传成功
const handleUploadSuccess = (response, uploadFile) => {
  console.log("res", response);
  if (response.code == 0) value.image = response.path;
  else showMsg.err(response.message);
  console.log("upload", uploadFile);
};

// 上传前准备
const beforeUpload = (rawFile) => {
  let res = true;
  const allowType = ["image/jpeg", "image/png"];
  const fileSize = rawFile.size / 1024;
  console.log(type, rawFile, fileSize);
  if (!allowType.includes(rawFile.type)) {
    showMsg.err("文件格式不正确，必须为jpg或者png格式");
    console.log(-1);
    return Promise().reject();
  }
  if (fileSize / 1024 > 2) {
    showMsg.err("图片不能大于2M");
    console.log(-3);
    return Promise().reject();
  }
  return res;
};
</script>
<style scoped>
.opt_delete > i {
  display: inline-block;
  line-height: 2rem;
}
.opt_delete {
  display: block;
  line-height: 2rem;
  text-align: center;
  cursor: pointer;
}
</style>
