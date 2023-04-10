<template>
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
    <el-form-item label="拉黑" prop="black" v-if="id !== 0">
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
        <el-popconfirm
          title="确定删除吗？"
          confirmButtonText="确定"
          cancelButtonText="取消"
          @confirm="handleDelete('address', i)"
        >
          <template #reference>
            <a style="cursor: pointer">删除</a>
          </template>
        </el-popconfirm>
        <el-form-item label="地址">
          <el-input type="text" v-model="state.address[i].address" />
        </el-form-item>
        <el-form-item label="面积">
          <el-input type="number" v-model="state.address[i].area" />
        </el-form-item>
      </div>
      <div class="text-center text-plus" @click="handleAdd('address')">
        <i class="fa-solid fa-plus"></i>
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
        <el-popconfirm
          title="确定删除吗？"
          confirmButtonText="确定"
          cancelButtonText="取消"
          @confirm="handleDelete('contract', i)"
        >
          <template #reference>
            <a style="cursor: pointer">删除</a>
          </template>
        </el-popconfirm>
        <el-form-item label="合同编号">
          <el-input type="text" v-model="state.contract[i].contract_code" />
        </el-form-item>
        <el-form-item label="服务类型">
          <el-select-v2
            v-model="state.contract[i].type"
            :options="options"
            placeholder="Please select"
          />
        </el-form-item>
        <el-form-item label="服务时间">
          <el-date-picker
            v-model="state.contract[i].time"
            type="daterange"
            start-placeholder="选择开始时间"
            end-placeholder="选择到期时间"
            :default-time="state.contract[i].time"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="text" v-model="state.contract[i].remark" />
        </el-form-item>
      </div>
      <div class="text-center text-plus" @click="handleAdd('contract')">
        <i class="fa-solid fa-plus"></i>
      </div>
    </el-card>
  </el-scrollbar>
</template>
<script setup>
import { reactive, onMounted, getCurrentInstance, ref } from "vue";
import { pinyin } from "pinyin-pro";

const { urls, req, showMsg } =
  getCurrentInstance().appContext.config.globalProperties;

const emit = defineEmits(["loadErr", "disable"]);
const props = defineProps(["id", 'mobile']);
const id = props["id"];
const formRef = ref();
const rules = {
  name: [{ required: "true", message: "姓名不能为空", trigger: ["blur"] }],
  pinyin: [{ required: "true", message: "拼音不能为空", trigger: ["blur"] }],
  pym: [{ required: "true", message: "拼音码不能为空", trigger: ["blur"] }],
  mobile: [{ required: "true", message: "请输入手机号", trigger: "blur" }],
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
const state = reactive({
  emp_load: false,
  contract: [
    {
      contract_code: "",
      contract_path: "",
      create_time: "",
      customer_id: id,
      deleted: 0,
      id: 0,
      remark: "",
      time: [null, null],
      type: 0,
    },
  ],
  contract_del: new Set(),
  address: [
    {
      address: "",
      area: "",
      customer_id: id,
      id: 0,
    },
  ],
  address_del: new Set(),
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
  })
    .replaceAll(" ", "")
    .toUpperCase();
};

// 获取初始信息
const get_emp_info = () => {
  if (id === undefined || (id !== undefined && id < 1)) {
    const mobile = props['mobile'];
    if (typeof(mobile) == 'string' && mobile.trim() !== '')
      state.ruleForm.mobile = mobile;
    return;
  }
  state.emp_load = true;
  req.get(
    `${urls.customer_detail}/id/${id}`,
    ({ detail, contract, address }) => {
      state.ruleForm = { ...detail };
      contract.forEach((c, i) => {
        const { start_time, end_time } = c;
        contract[i] = {
          ...c,
          time: [new Date(start_time), new Date(end_time)],
        };
      });
      state.contract = contract;
      state.address = address;
      state.emp_load = false;
    },
    (e) => emit("loadErr", e)
  );
};

const trimArr = (d) => {
  d.forEach((c, i) => {
    for (const k in c) {
      if (typeof c[k] == "string") d[i][k] = c[k].trim();
    }
    if (c?.time) {
      d[i]["start_time"] =
        c.time[0] && c.time[0] instanceof Date
          ? `${c.time[0].getFullYear()}-${
              c.time[0].getMonth() + 1
            }-${c.time[0].getDate()}`
          : "";
      d[i]["end_time"] =
        c.time[1] && c.time[1] instanceof Date
          ? `${c.time[1].getFullYear()}-${
              c.time[1].getMonth() + 1
            }-${c.time[1].getDate()}`
          : "";
    }
  });
  return d;
};

const getOriginData = ()=>{
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
    let { contract, address, contract_del, address_del } = state;
    contract = trimArr(contract);
    address = trimArr(address);
    return {
        id,
        name,
        mobile: mobile.replaceAll("，", ","),
        black: black === true ? 1 : 0,
        pym,
        pinyin,
        remark,
        total_money,
        total_count,
        contract_del: Array.from(contract_del),
        address_del: Array.from(address_del),
        contract: contract.filter(
          (c) => c.type !== 0 || c.contract_code.trim() !== ""
        ),
        address: address.filter((a) => a.address.trim() !== ""),
      }
};

const validateData = (fun)=>{
  formRef.value.validate((valid, err) => {
    if (!valid) {
      for (const k in err) {
        showMsg.err(err[k][0].message);
        break;
      }
      return;
    }
    if (fun instanceof Function) fun();
  });
}
const submit = async (fun) => {
  validateData(()=>{
    const url = id == 0 ? urls.customer_add : urls.customer_alter;
    const method = id == 0 ? "post" : "put";
    emit("disable", true);
    req[method](
      url,
      getOriginData(),
      (d) => {
        emit("disable", false);
        state.ruleForm = {
          name: "",
        };
        showMsg.succ("提交成功！");
        if (fun instanceof Function) fun(d);
      },
      (e) => {
        console.warn(e);
        emit("disable", false);
      }
    );
  })
};
const example = {
  contract: {
    contract_code: "",
    contract_path: "",
    create_time: "",
    customer_id: id,
    deleted: 0,
    id: 0,
    remark: "",
    time: [null, null],
    type: 0,
  },
  address: {
    address: "",
    area: "",
    customer_id: id,
    id: 0,
  },
};
const handleAdd = (a) => state[a].push({ ...example[a] });
const handleDelete = (a, ind) => {
  state[a][ind].id !== 0 && state[`${a}_del`].add(state[a][ind].id);
  state[a] = state[a].filter((i, j) => j !== ind);
};
defineExpose({ submit, getOriginData, validateData });
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
