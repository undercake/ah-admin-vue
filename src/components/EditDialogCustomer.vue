<template>
  <el-dialog
    :title="id == 0 ? '添加客户' : '编辑客户'"
    :model-value="true"
    width="30%"
    center
    :close-on-click-modal="false"
    :show-close="false"
  >
    <template #header>
      <span role="heading" class="el-dialog__title">
        {{ id == 0 ? "添加" : "编辑" }} 客户
      </span>
      <button
        class="el-dialog__headerbtn"
        type="button"
        :disabled="disable_close"
        @click="handleClose"
      >
        <i class="el-icon el-dialog__close fa-solid fa-xmark-large fa-fw" />
      </button>
    </template>
    <edit-core-customer
      :id="id"
      ref="formRef"
      @loadErr="handleClose"
      @disable="(e) => (disable_close = e)"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" :disabled="disable_close">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submit_form"
          :disabled="disable_close"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import EditCoreCustomer from "./EditCoreCustomer.vue";

const emit = defineEmits(["closed", "reload"]);
const props = defineProps(["id"]);
const id = props["id"];
const formRef = ref();
const disable_close = ref(false);

const handleClose = (e) => {
  emit("closed", e);
};

const submit_form = (e) => {
  formRef.value.submit(() => {
    emit("reload", e);
    emit("closed", e);
  });
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
.text {
  font-size: 14px;
}

.item {
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}
.text.item {
  border-bottom: 1px solid var(--el-border-color);
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
  border: var(--el-color-primary-light-3) solid 1px;
}
</style>
