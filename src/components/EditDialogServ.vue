<template>
  <el-dialog
    v-model="state.is_edit"
    :title="state.edit_id == 0 ? '添加员工' : '编辑员工'"
    width="30%"
    center
    :close-on-click-modal="false"
  >
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
              :on-success="(...e)=>{handleUploadSuccess('avatar', ...e)}"
              :before-upload="(...e)=>{beforeUpload('avatar', ...e)}"
              accept="image/*"
            >
              <img v-if="state.avatar!= ''" :src="state.ruleForm.avatar" class="avatar" />
              <i v-else class="fa fa-regular fa-plus-large"></i>
            </el-upload>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          type="text"
          @input="name_change"
          v-model="state.ruleForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select
          v-model="state.ruleForm.gender"
          class="m-2"
          placeholder="性别"
        >
          <el-option
            v-for="(item, ind) in ['男', '女']"
            :key="ind"
            :label="item"
            :value="ind"
        /></el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input type="text" v-model="state.ruleForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="身份证号" prop="phone">
        <el-input type="text" v-model="state.ruleForm.id_code"></el-input>
      </el-form-item>
      <el-form-item label="现住址" prop="address">
        <el-input type="text" v-model="state.ruleForm.address"></el-input>
      </el-form-item>
      <el-form-item label="籍贯" prop="origin">
        <el-input type="text" v-model="state.ruleForm.origin"></el-input>
      </el-form-item>
      <el-form-item label="简介" prop="intro">
        <el-input type="text" v-model="state.ruleForm.intro"></el-input>
      </el-form-item>
      <el-form-item label="工作内容" prop="workee">
        <el-input type="text" v-model="state.ruleForm.workee"></el-input>
      </el-form-item>
      <el-form-item label="拼音" prop="pinyin">
        <el-input type="text" v-model="state.ruleForm.pinyin"></el-input>
      </el-form-item>
      <el-form-item label="拼音码" prop="pym">
        <el-input type="text" v-model="state.ruleForm.pym"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input type="text" v-model="state.ruleForm.note"></el-input>
      </el-form-item>
        <el-form-item label="出生日期" prop="birth_date">
            <el-date-picker
              type="date"
              :editable="false"
              placeholder="选择时间"
              v-model="state.ruleForm.birth_date"
            />
        </el-form-item>
        <el-form-item label="入职日期" prop="work_date">
          <el-date-picker
            type="date"
            :editable="false"
            placeholder="选择时间"
            v-model="state.ruleForm.work_date"
          />
        </el-form-item>
      <el-form-item label="学历" prop="grade">
        <el-select
          v-model="state.ruleForm.grade"
          class="m-2"
          placeholder="学历"
        >
          <el-option
            v-for="(item, ind) in [
              '未知',
              '小学',
              '初中',
              '高中',
              '中专',
              '技校',
              '大专',
              '本科',
              '硕士',
              '博士',
            ]"
            :key="ind"
            :label="item"
            :value="ind"
        /></el-select>
      </el-form-item>
      <el-form-item label="详情图片" prop="img">
              <el-upload
              class="avatar-uploader"
              :action="urls.upload_public"
              :show-file-list="false"
              :on-success="(...e)=>{handleUploadSuccess('img',...e)}"
              :before-upload="(...e)=>{beforeUpload('img',...e)}"
              accept="image/*"
            >
              <img v-if="state.ruleForm.img!= ''" :src="state.ruleForm.img" class="img" />
              <i v-else class="fa fa-regular fa-plus-large"></i>
            </el-upload>
      </el-form-item>
    </el-form>
    <el-skeleton :rows="3" animated v-if="state.emp_load" />
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
import { pinyin } from "pinyin-pro";

const { urls, req, showMsg, hasRights } =
  getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits();
onMounted(() => {});

const v_city = {
  11: "北京",
  12: "天津",
  13: "河北",
  14: "山西",
  15: "内蒙古",
  21: "辽宁",
  22: "吉林",
  23: "黑龙江",
  31: "上海",
  32: "江苏",
  33: "浙江",
  34: "安徽",
  35: "福建",
  36: "江西",
  37: "山东",
  41: "河南",
  42: "湖北",
  43: "湖南",
  44: "广东",
  45: "广西",
  46: "海南",
  50: "重庆",
  51: "四川",
  52: "贵州",
  53: "云南",
  54: "西藏",
  61: "陕西",
  62: "甘肃",
  63: "青海",
  64: "宁夏",
  65: "新疆",
  71: "台湾",
  81: "香港",
  82: "澳门",
  91: "国外",
};
const formRef = ref(null);
const state = reactive({
  id: -1,
  is_edit: false,
  emp_load: false,
  load_all: false,
  disable_close: false,
  emp_list: [],
  ruleForm: {
    avatar:'',
    name: "",
    phone: "",
    address: "",
    intro: "",
    gender: 0,
    id_code: "",
    pinyin: "",
    pym: "",
    birth_date: "",
    work_date: "",
    grade: 0,
    origin:'',
    workee:'',
    note:''
  },
  rights_selected: new Set([]),
  rules: {
    name: [{ required: "true", message: "姓名不能为空", trigger: ["blur"] }],
    phone: [
      { len: 11, message: "请输入正确的手机号", trigger: "blur" },
      {
        pattern: /^1[3456789]\d{9}$/,
        message: "手机号码格式不正确",
        trigger: "blur",
      },
    ],
    id_code: [
      //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      {
        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        message: "身份证号格式不正确",
        trigger: "blur",
      },
      //取身份证前两位,校验省份
      {
        validator: (id) => v_city[id.substr(0, 2)] !== undefined,
        message: "身份证号省份格式不正确",
        trigger: "blur",
      },
      {
        validator: (id) => {
          const _date = id.match(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
          const new_date = new Date(_date[2] + "/" + _date[3] + "/" + _date[4]);
          return new_date.getFullYear() == _date[2] &&
                  new_date.getMonth() + 1 == _date[3] &&
                  new_date.getDate() == _date[4];
        },
        message: "身份证号日期格式不正确",
        trigger: "blur",
      },
      // 校验位
      {
        validator: (id) => {
          const intArr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
          const intCh = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
          let val_sum = 0;
          id.split('').forEach((d, i) => {
            if (i >= 17) return;
            val_sum += intArr[i] * parseInt(d);
          });
          return intCh[val_sum % 11] == id.split('')[17];
        },
        message: "身份证号校验格式不正确",
        trigger: "blur",
      },
    ],
    pinyin: [{ required: "true", message: "拼音不能为空", trigger: ["blur"] }],
    pym: [{ required: "true", message: "拼音码不能为空", trigger: ["blur"] }],
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
    get_emp_info();
  }
};

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

const close = () => (state.is_edit = false);

// 获取初始信息
const get_emp_info = () => {
  state.load_all = true;
  const id = state.id;
  req.get(`${urls.employee_detail}/id/${id}`, ({ detail }) => { detail;
    const {birth_date,work_date} = detail;
    state.ruleForm = {...detail};
    console.log({birth_date,work_date});
    state.ruleForm.birth_date = birth_date == '0000-00-00' ? '' : birth_date;
    state.ruleForm.work_date = work_date == '0000-00-00' ? '' : work_date;
    state.rights_selected.clear();
    console.log(detail, state.rights_selected);
    state.load_all = false;
  });
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
      note
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
        note
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
  console.log('res', response);
  if (response.code == 0) state.ruleForm[type] = response.path;
  else showMsg.err(response.message);
  console.log('upload', uploadFile);
}

const beforeUpload = (type, rawFile) => {
  let res = true;
  const allowType = ['image/jpeg', 'image/png'];
  const fileSize = rawFile.size / 1024;
  console.log(type, rawFile, fileSize);
  if (!allowType.includes(rawFile.type)) {
    showMsg.err('文件格式不正确，必须为jpg或者png格式');
    console.log(-1);
    return (new Promise).reject();
  }
  if (type == 'avatar' && fileSize > 300) {
    showMsg.err('头像不能大于300K');
    console.log(-2);
    return (new Promise).reject();
  }
  if (fileSize / 1024 > 2) {
    showMsg.err('图片不能大于2M');
    console.log(-3);
    return (new Promise).reject();
  }
  return res;
}

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
img.avatar{
  width: 80px;
  height: 80px;
}
img.img{
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
