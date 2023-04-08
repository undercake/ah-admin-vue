<template>
  <el-dialog
    :title="state.edit_id == 0 ? '添加客户' : '编辑客户'"
    :model-value="true"
    width="30%"
    center
    :close-on-click-modal="false"
    :show-close="false"
  >
    <template #header>
      <span role="heading" class="el-dialog__title">
        {{ id == 0 ? "添加" : "编辑" }}服务
      </span>
      <button
        class="el-dialog__headerbtn"
        type="button"
        :disabled="state.disable_close"
        @click="handleClose"
      >
        <i class="el-icon el-dialog__close fa-solid fa-xmark-large fa-fw" />
      </button>
    </template>
    <el-skeleton :rows="5" animated v-if="state.emp_load" />
    <el-form
      :model="state.ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="good-form"
      v-if="!state.emp_load"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          type="text"
          @input="name_change"
          v-model="state.ruleForm.name"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input type="text" v-model="state.ruleForm.mobile" />
      </el-form-item>
      <el-form-item label="拉黑" prop="black">
        <el-switch
          v-model="state.ruleForm.black"
          style="--el-switch-on-color: #ff4949"
        />
      </el-form-item>
      <el-form-item label="拼音码" prop="pym">
        <el-input type="text" v-model="state.ruleForm.pym" />
      </el-form-item>
      <el-form-item label="拼音" prop="pinyin">
        <el-input type="text" v-model="state.ruleForm.pinyin" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="text" v-model="state.ruleForm.remark" />
      </el-form-item>
      <el-form-item label="账户余额" prop="total_money">
        <el-input type="text" v-model="state.ruleForm.total_money" />
      </el-form-item>
      <el-form-item label="剩余次数" prop="total_count">
        <el-input type="text" v-model="state.ruleForm.total_count" />
      </el-form-item>
    </el-form>
    <el-scrollbar>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>地址</span>
          </div>
        </template>
        <div v-for="(l, i) in state.address" :key="i" class="text item">
          <el-text> 地址 {{ i + 1 }} </el-text>
          <el-form-item label="地址" :prop="address + i">
            <el-input type="text" v-model="state.address[i].address" />
          </el-form-item>
          <el-form-item label="面积" :prop="area + i">
            <el-input type="number" v-model="state.address[i].area" />
          </el-form-item>
        </div>
      </el-card>
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span>服务</span>
          </div>
        </template>
        <div v-for="(l, i) in state.contract" :key="i" class="text item">
          <el-text> 合同 {{ i + 1 }} </el-text>
          <el-form-item label="合同编号" :prop="contract_code + i">
            <el-input type="text" v-model="state.contract[i].contract_code" />
          </el-form-item>
          <el-form-item label="服务类型" :prop="type + i">
            <el-select-v2
              v-model="state.contract[i].type"
              :options="options"
              placeholder="Please select"
            />
          </el-form-item>
          <el-form-item label="服务时间" :prop="start_time + i">
            <el-date-picker
              v-model="state.contract[i].time"
              type="daterange"
              start-placeholder="选择开始时间"
              end-placeholder="选择到期时间"
              :default-time="state.contract[i].time"
            />
          </el-form-item>
          <el-form-item label="备注" :prop="remark + i">
            <el-input type="text" v-model="state.contract[i].remark" />
          </el-form-item>
        </div>
      </el-card>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" :disabled="state.disable_close">
          取消
        </el-button>
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
import { pinyin } from "pinyin-pro";

const { urls, req, showMsg } =
  getCurrentInstance().appContext.config.globalProperties;
onMounted(() => {});

const emit = defineEmits(["closed", "reload"]);
const props = defineProps(["id"]);
const rules = {
  name: [{ required: "true", message: "姓名不能为空", trigger: ["blur"] }],
  mobile: [
    { len: 11, message: "请输入正确的手机号", trigger: "blur" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "手机号码格式不正确",
      trigger: "blur",
    },
  ],
  pinyin: [{ required: "true", message: "拼音不能为空", trigger: ["blur"] }],
  pym: [{ required: "true", message: "拼音码不能为空", trigger: ["blur"] }],
};
const options = [
  { value: 0, label: "暂无" },
  { value: 1, label: "钟点" },
  { value: 2, label: "包周" },
  { value: 3, label: "包做" },
  { value: 4, label: "年卡" },
  { value: 5, label: "季卡" },
  { value: 6, label: "月卡" },
  { value: 7, label: "半月卡" },
];
const id = props["id"];
const formRef = ref();
const state = reactive({
  emp_load: false,
  disable_close: false,
  contract: [],
  address: [],
  ruleForm: {
    name: "",
    mobile: "",
    black: 0,
    pym: "",
    pinyin: "",
    remark: "",
    total_money: 0,
    total_count: 0,
  },
});

const handleClose = (e) => {
  emit("closed", e);
};

onMounted(() => {
  get_emp_info();
});
// 名字变化时更新拼音和拼音码
const name_change = () => {
  state.ruleForm.pinyin = pinyin(state.ruleForm.name, {
    mode: "surname",
    toneType: "none",
    nonZh: "removed",
    v: true,
  }).replaceAll(" ", "");
  state.ruleForm.pym = pinyin(state.ruleForm.name, {
    mode: "surname",
    pattern: "first",
    toneType: "none",
    nonZh: "removed",
    v: true,
  }).replaceAll(" ", "");
};

// 获取初始信息
const get_emp_info = () => {
  if (id !== undefined && id < 1) return;
  state.emp_load = true;
  req.get(
    `${urls.customer_detail}/id/${id}`,
    ({ detail, contract, address }) => {
      state.ruleForm = { ...detail };
      contract.forEach((c,i) => {
        const {start_time, end_time} = c;
        contract[i] = {...c, time: [new Date(start_time), new Date(end_time)]};
      });
      state.contract = contract;
      state.address = address;
      state.emp_load = false;
    },
    () => emit("closed", e)
  );
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
      name,
      mobile,
      black,
      pym,
      pinyin,
      remark,
      total_money,
      total_count,
    } = state.ruleForm;
    const url = id == 0 ? urls.customer_add : urls.customer_alter;
    const method = id == 0 ? "post" : "put";
    req[method](
      url,
      {
        id,
        name,
        mobile,
        black,
        pym,
        pinyin,
        remark,
        total_money,
        total_count,
      },
      (d) => {
        state.disable_close = false;
        state.ruleForm = {
          name: "",
        };
        showMsg.succ("提交成功！");
        emit("reload", true);
        emit("closed", true);
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
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
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
