<template lang="">
  <layout>
    <el-card class="category-container">
      <template #header>
        <div class="header">
          <el-input
            v-model="state.searchStr"
            class="search"
            size="large"
            placeholder="电话查找客户信息"
            clearable
            @keydown.enter="getData"
            @input="on11Get"
          />
          <el-button type="primary" @click="getData" :loading="state.loading">
            <i class="fa fa-solid fa-magnifying-glass" />
            搜索
          </el-button>
        </div>
      </template>
      <el-skeleton :rows="3" animated v-if="state.loading" />
      <div v-if="!state.empty && !state.loading" class="addr-selector">
        <el-radio-group v-model="state.client_id" @change="addr_change">
          <div v-for="(c, i) in state.client_data" :key="i">
            <el-radio :label="c.id" size="large" border>
              <el-text>
                <el-tag
                  v-if="c.type > 0"
                  type="warning"
                  class="mx-1"
                  effect="plain"
                  round
                >
                  {{ ["VIP", "重要领导"][c.type - 1] }}
                </el-tag>
                姓名：{{ c.name }} &nbsp;&nbsp; 电话：{{
                  c.mobile
                }}
                &nbsp;&nbsp; 剩余金额：{{ c.total_money }} &nbsp;&nbsp;
                剩余次数：{{ c.total_count }} &nbsp;&nbsp; 备注：{{ c.remark }}
              </el-text>
            </el-radio>
            <el-text
              @click="() => (state.edit_id = c.id)"
              class="edit"
              style="margin-left: -15px"
            >
              编辑
            </el-text>
            <el-popconfirm
              title="确定删除吗？"
              confirmButtonText="确定"
              cancelButtonText="取消"
              @confirm="handleDelete('client', c.id)"
            >
              <template #reference>
                <el-text class="edit" style="margin-left: 10px">删除</el-text>
              </template>
            </el-popconfirm>
          </div>
        </el-radio-group>
      </div>
      <el-row
        v-if="state.location_data.length > 0 && !state.loading"
        :gutter="20"
      >
        <el-col :span="2">
          选择地址：<br />
          <el-text
            @click="() => (state.edit_id = state.client_id)"
            class="edit"
            v-if="state.client_id > 0"
          >
            编辑
          </el-text>
        </el-col>
        <el-col :span="20">
          <div v-if="state.location_data.length > 0">
            <el-radio-group v-model="state.local_id">
              <div v-for="(c, i) in state.location_data" :key="i">
                <el-radio
                  :label="c.id"
                  size="large"
                  border
                  v-if="c.customer_id == state.client_id"
                >
                  面积：{{ c.area }} 地址：{{ c.address }}
                </el-radio>
              </div>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="state.serv_data.length > 0 && !state.loading" :gutter="20">
        <el-col :span="2">
          选择服务项目：<br />
          <el-text
            @click="() => (state.edit_id = state.client_id)"
            class="edit"
            v-if="state.client_id > 0"
          >
            编辑
          </el-text>
        </el-col>
        <el-col :span="20">
          <el-radio-group v-model="state.serv_id">
            <div v-for="(c, i) in state.serv_data" :key="i">
              <el-radio
                :label="c.id"
                size="large"
                border
                v-if="c.customer_id == state.client_id"
              >
                <el-text>
                  <el-tag
                    :type="serv_type_color[c.type]"
                    class="mx-1"
                    effect="dark"
                  >
                    {{ serv_types[c.type] }}
                  </el-tag>
                </el-text>
                <el-text style="margin-left: 0.5rem">
                  {{ c.contract_code }}
                </el-text>
                <el-text style="margin-left: 0.5rem" v-if="c.type != 1">
                  <el-tag
                    :type="
                      c.expired ? 'danger' : c.near ? 'warning' : 'success'
                    "
                    class="mx-1"
                    effect="dark"
                  >
                    {{ c.expired ? "已" : c.near ? "即将" : "未" }}过期
                  </el-tag>
                  {{ c.end_time }}
                </el-text>
                <el-text> {{ c.remark }} </el-text>
              </el-radio>
            </div>
          </el-radio-group>
        </el-col>
      </el-row>
      <div style="width: 35rem">
        <edit-core-customer
          v-if="state.edit_now_id == 0"
          :id="state.edit_now_id"
          ref="formRef"
          :mobile="state.searchStr"
          @loadErr="() => (state.edit_now_id = -1)"
          @disable="(e) => (state.disable_close = e)"
        />
      </div>
    </el-card>
    <el-card
      v-if="
        (state.empty && state.edit_now_id == 0) ||
        (![undefined, 0].includes(state.client_id) &&
          ![undefined, 0].includes(state.local_id) &&
          ![undefined, 0].includes(state.serv_id))
      "
    >
      <el-form
        :model="state.ruleForm"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        class="good-form"
        v-if="!state.load_all"
      >
        <el-form-item label="选择服务类目" prop="">
          <el-select-v2
            v-model="state.category_id"
            :options="state.categories"
            :loading="categories_loading"
            placeholder="请选择服务类目"
            @focus="loadAll()"
            @change="category_change"
            allow-create
            clearable
          />
          <el-select-v2
            v-model="state.service_id"
            :options="state.services"
            :loading="services_loading"
            placeholder="请选择服务"
            @focus="loadAll()"
            @change="services_change"
            allow-create
            clearable
          />
          <el-select-v2
            v-model="state.option_id"
            :options="state.options"
            :loading="options_loading"
            placeholder="请选择服务选项"
            @focus="loadAll()"
            @change="getPrice"
            allow-create
            clearable
          />
          <el-text
            v-if="
              state.price != 0 &&
              state.option_id != 0 &&
              state.option_id !== undefined
            "
            style="margin-left: 1rem"
          >
            {{ state.price }} 元
          </el-text>
        </el-form-item>
        <el-form-item label="预定时间" prop="time">
          <el-date-picker
            v-model="state.ruleForm.time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="最早时间"
            end-placeholder="最迟时间"
          />
        </el-form-item>
        <el-form-item label="特殊需求" prop="special_needs">
          <el-input :autosize="{ minRows: 1}" type="textarea" v-model="state.ruleForm.special_needs" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input :autosize="{ minRows: 1}" type="textarea" v-model="state.ruleForm.remark" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card
      v-if="
        (state.empty && state.edit_now_id == 0) ||
        (![undefined, 0].includes(state.client_id) &&
          ![undefined, 0].includes(state.local_id) &&
          ![undefined, 0].includes(state.serv_id))
      "
    >
      <template #header>
        <el-form-item label="随机派工">
          <el-switch
            v-model="state.autoEmp"
            class="ml-2"
            style="--el-switch-on-color: #13ce66;"
            :loading="state.changeLoading"
            :before-change="beforeChange"
          />
        </el-form-item>
      </template>
      <!-- 随机派工 -->
      <div v-if="state.autoEmp"></div>
      <!-- 非随机派工 -->
      <div v-else></div>
    </el-card>
    <edit-dialog-customer
      v-if="state.edit_id > -1"
      :id="state.edit_id"
      @closed="() => (state.edit_id = -1)"
      @reload="getData(0)"
    />
  </layout>
</template>
<script lang="ts">
import { onMounted, reactive, getCurrentInstance, ref } from "vue";
import Layout from "@/components/Layout.vue";
import EditCoreCustomer from "@/components/EditCoreCustomer.vue";
import EditDialogCustomer from "@/components/EditDialogCustomer.vue";
import { ElMessageBox } from "element-plus";
import type {
  customer_dataset,
  customer_list,
  customer_addr,
  customer_services,
  service_category,
  service_dataset,
  req_service_category,
  req_service_option,
  service_option,
  service,
  remain
} from "../utils/type.d.ts";

type EditCoreCustomerType = InstanceType<typeof EditCoreCustomer>;
interface orderFrom{
  order_time    : string,
  order_time_end: string,
  remark        : string,
  special_needs : string,
  time          : Date[]|undefined[]|string[]
}
interface Order_add_data {
  disable_close: boolean;
  edit_id      : number;
  edit_now_id  : number;
  loading      : boolean;
  empty        : boolean;
  searchStr    : string;
  client_id    : number | string | undefined;
  local_id     : number | string | undefined;
  serv_id      : number | string | undefined;
  category_id  : number | string | undefined;
  service_id   : number | string | undefined;
  option_id    : number | string | undefined;
  categories   : Opts[];
  services     : Opts[];
  options      : Opts[];
  client_data  : customer_list[];
  location_data: customer_addr[];
  serv_data    : customer_services[];
  price        : number | string;
  ruleForm:orderFrom,
  autoEmp:boolean,
  changeLoading:boolean,
  remain:number
}
interface Opts {
  value: number | string;
  label: number | string;
}
const serv_types: string[] = [
  "暂无",
  "钟点",
  "包周",
  "包做",
  "年卡",
  "季卡",
  "月卡",
  "半月卡",
];

const serv_type_color: string[] = [
  "info",
  "info",
  "",
  "",
  "success",
  "success",
  "success",
  "",
];
let categories_loaded: boolean = false;
let services_loaded: boolean   = false;
let options_loaded: boolean    = false;
let services: service[]        = [];
let option: service_option[]   = [];
const rules = {};
</script>
<script setup lang="ts">
const { urls, showMsg, req } =
  getCurrentInstance()?.appContext.config.globalProperties;

const handleDelete = (e, a) => console.log(e, a);
const handleEdit = (e, a) => console.log(e, a);
const formRef = ref<EditCoreCustomerType | null>(null);

let categories_loading = ref<boolean>(false);
let services_loading   = ref<boolean>(false);
let options_loading    = ref<boolean>(false);

const state = reactive<Order_add_data>({
  disable_close: false,
  edit_id      : -1,
  edit_now_id  : -1,
  loading      : false,
  empty        : false,
  searchStr    : "",
  client_id    : undefined,
  local_id     : undefined,
  serv_id      : undefined,
  category_id  : undefined,
  service_id   : undefined,
  option_id    : undefined,
  client_data  : [],
  location_data: [],
  serv_data    : [],
  categories   : [],
  services     : [],
  options      : [],
  price        : 0,
  ruleForm     : {
    remark        : '',
    order_time    : '',
    order_time_end: '',
    special_needs : '',
    time: [undefined, undefined]
  },
  autoEmp: true,
  changeLoading:false,
  remain : 0
});

onMounted(()=>{
  order_get_remain();
});

const order_get_remain = ()=>{
  req.get(urls.order_get_remain, (d:remain)=>state.remain = parseInt(`${d.data}`));
}

const addr_change = () => {
  state.local_id = undefined;
  state.serv_id = undefined;
};

const category_change = () => {
  state.service_id = undefined;
  state.option_id = undefined;
  const tmpOpt: Opts[] = [];
  if (services.length < 1) loadCore(true, services_loaded, "services_list");
  services.forEach(
    (a) =>
      a.class_id == state.category_id && tmpOpt.push({ label: a.name, value: a.id })
  );
  state.services = tmpOpt;
};
const services_change = () => {
  state.option_id = undefined;
  const tmpOpt: Opts[] = [];
  if (option.length < 1) loadCore(true, options_loaded, "services_options");
  option.forEach(
    (a) =>
      a.service_id == state.service_id && tmpOpt.push({ label: a.name, value: a.id })
  );
  state.options = tmpOpt;
};

const on11Get = (v: string) => v.length >= 11 && getData();
let cancel: false | Function = false;
const getData = () => {
  const mobile = state.searchStr.trim();
  state.edit_id = -1;
  state.edit_now_id = -1;
  const currentDate = new Date();
  state.serv_data = [];
  state.location_data = [];
  state.client_data = [];
  if (cancel) cancel();
  if (mobile == "") return;
  state.loading = true;
  cancel = req.post(
    `${urls.customer_search}/page/1`,
    { mobile },
    (d: customer_dataset) => {
      state.loading = false;
      console.log(d.data.length);

      if (d.data.length == 0) {
        state.empty = true;
        state.edit_now_id = 0;
        return;
      }
      state.empty = false;
      state.client_data = d.data;
      state.location_data = d.addr;
      console.log(state.location_data);
      const serv_data = [];
      for (const k in d.services) serv_data.push(...d.services[k]);
      serv_data.forEach((e, i) => {
        const end_date = new Date(e.end_time);
        const expired = end_date < currentDate;
        const near = expired
          ? false
          : end_date.getTime() - currentDate.getTime() < 2678400000;
        serv_data[i] = { ...e, expired, near };
      });
      state.serv_data = serv_data;
      state.client_id = undefined;
      state.local_id = undefined;
      state.serv_id = undefined;
    },
    (d) => {
      state.loading = false;
    }
  );
};

const getPrice = () => {
  for (const item of option) {
    if (item.id == state.option_id) {
      state.price = item.price;
      break;
    }
  }
};

const beforeChange = () => {
  state.changeLoading = true
  return new Promise((solve, reject) => {
    if (state.autoEmp === false || state.remain == -1) {
      state.changeLoading = false;
      return solve(true);
    }
    if (state.autoEmp === true &&  state.remain == 0) {
      ElMessageBox.alert('您的指定派工次数已用完');
      reject(true);
    }
    const $remain:number|string = state.remain == -1 ? '不限' : state.remain ;
    ElMessageBox.confirm(`您的指定派工次数为 ${$remain} 次，您确定要指定派工吗？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "info",
  }).then(solve)
  .catch(reject)
  .finally(()=>{
    state.changeLoading = false;
  })
  })
}

const loadAll = () => {
  changeLoading(true);
  loadCore(false, categories_loaded, "services_category");
  loadCore(false, services_loaded, "services_list");
  loadCore(false, options_loaded, "services_options");
};
const forceLoadAll = () => {
  changeLoading(true);
  ["services_category", "services_list", "services_options"].forEach((a) =>
    loadCore(true, true, a)
  );
};
const service_func = {
  services_list(d: service_dataset) {
    // state.services = d.data.map((a):Opts =>{return {label: a.name, value: a.id}});
    services = d.data;
    services_loaded = true;
  },
  services_category(d: req_service_category) {
    state.categories = d.data.map((a): Opts => {
      return { label: a.name, value: a.id };
    });
    categories_loaded = true;
  },
  services_options(d: req_service_option) {
    // state.options = d.data.map((a):Opts =>{return {label: a.name, value: a.id}});
    options_loaded = true;
    option = d.data;
  },
};
const changeLoading = (opt: boolean) => {
  categories_loading = opt;
  services_loading = opt;
  options_loading = opt;
};
const loadCore = (force: boolean, itemLoaded: boolean, urlKey: string) => {
  if (force || !itemLoaded) {
    changeLoading(true);
    req.get(
      urls[urlKey],
      (d) => {
        service_func[urlKey](d);
        changeLoading(false);
      },
      () => changeLoading(false)
    );
  } else changeLoading(false);
};

const handleSubmit = () => {};
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 480px;
}
.search {
  width: 12rem;
  margin: 0 0.6rem;
}
.edit {
  color: #409eff;
  cursor: pointer;
}
.good-form{
  margin-top: 2rem;
  width: 35%;
  min-width: 300px;
}
.el-card:not(:first-child) {
  margin-top: 1rem;
}

.el-select-v2 {
  display: block;
  width: 100%;
  padding-right: 2rem;
}
.el-select-v2:not(:first-child) {
  margin-top: 1rem;
}
</style>
<style>
.addr-selector .el-radio-group > div {
  width: 100%;
}
.addr-selector > .el-radio-group {
  display: block;
}
.el-radio-button {
  position: static;
  display: block;
  width: 100%;
  border-left: none;
  border: none;
}
label.el-radio-button--large .el-radio-button__inner,
.el-radio-button:first-child .el-radio-button__inner,
.el-radio-button:last-child .el-radio-button__inner {
  height: 40px;
  text-align: left;
  width: 100%;
  border-left: none;
  border: none;
}
.el-row {
  border-top: 1px solid var(--border-color);
  margin-top: 0.8rem;
}
.el-radio-group > div:has(> label) {
  height: 40px;
}
</style>
