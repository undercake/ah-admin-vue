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
            :disabled="state.loading"
          />
          <el-button
            type="primary"
            @click="getData"
            :loading="state.loading"
            :disabled="state.loading"
          >
            <i class="fa fa-solid fa-magnifying-glass" />
            搜索
          </el-button>
        </div>
      </template>
      <div v-if="!state.empty" class="addr-selector">
        <el-radio-group v-model="state.client_id" @change="addr_change">
          <div v-for="(c, i) in state.client_data" :key="i">
            <el-radio :label="c.id" size="large" border>
              <el-text>
                姓名：{{ c.name }} &nbsp;&nbsp; 电话：{{
                  c.mobile
                }}
                &nbsp;&nbsp; 剩余金额：{{ c.total_money }} &nbsp;&nbsp;
                剩余次数：{{ c.total_count }} &nbsp;&nbsp; 备注：{{ c.remark }}
              </el-text>
            </el-radio>
            <el-text class="edit" style="margin-left:-15px">
              编辑
            </el-text>
            <el-popconfirm
              title="确定删除吗？"
              confirmButtonText="确定"
              cancelButtonText="取消"
              @confirm="handleDelete('client' ,c.id)"
            >
              <template #reference>
                <el-text class="edit" style="margin-left:10px">删除</el-text>
              </template>
            </el-popconfirm>
          </div>
        </el-radio-group>
      </div>
      <el-row v-if="state.location_data.length > 0" :gutter="20">
        <el-col :span="2">
          选择地址：<br />
          <el-text class="edit" v-if="state.client_id > 0" @click="handleEdit('addr')">
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
                <el-popconfirm
                  title="确定删除吗？"
                  confirmButtonText="确定"
                  cancelButtonText="取消"
                  v-if="c.customer_id == state.client_id"
                  @confirm="handleDelete('location', c.id)"
                >
                  <template #reference>
                    <el-text class="edit" style="margin-left:-15px">删除</el-text>
                  </template>
                </el-popconfirm>
              </div>
            </el-radio-group>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="state.serv_data.length > 0" :gutter="20">
        <el-col :span="2">
          选择服务项目：<br />
          <el-text class="edit" v-if="state.client_id > 0" @click="handleEdit('serv')">
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
                <el-tag
                  :type="serv_type_color[c.type]"
                  class="mx-1"
                  effect="dark"
                >
                  {{ serv_types[c.type] }}
                </el-tag>
                <el-text truncated style="margin-left: 0.5rem">
                  {{ c.contract_code }}
                </el-text>
                <el-text
                  truncated
                  style="margin-left: 0.5rem"
                  v-if="c.type != 1"
                >
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
              <el-popconfirm
                title="确定删除吗？"
                confirmButtonText="确定"
                cancelButtonText="取消"
                v-if="c.customer_id == state.client_id"
                @confirm="handleDelete('serv', c.id)"
              >
                <template #reference>
                  <el-text class="edit" style="margin-left:-15px">删除</el-text>
                </template>
              </el-popconfirm>
            </div>
          </el-radio-group>
        </el-col>
      </el-row>
    </el-card>
  </layout>
</template>
<script setup>
import { onMounted, reactive, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";

const { urls, showMsg, req } =
  getCurrentInstance().appContext.config.globalProperties;

const serv_types = [
  "暂无",
  "钟点",
  "包周",
  "包做",
  "年卡",
  "季卡",
  "月卡",
  "半月卡",
];

const serv_type_color = [
  "info",
  "info",
  "",
  "",
  "success",
  "success",
  "success",
  "",
];

const state = reactive({
  loading: false,
  empty: false,
  searchStr: "",
  client_id: 0,
  local_id: 0,
  serv_id: 0,
  client_data: [],
  location_data: [],
  serv_data: [],
  formData: {
    name: "",
    remark: "",
    mobile: "",
  },
});

const addr_change = () => {
  state.local_id = 0;
  state.serv_id = 0;
};

const handleDelete = (e,a) =>console.log(e,a);
const handleEdit = (e,a) =>console.log(e,a);

const getData = () => {
  state.loading = true;
  const currentDate = new Date();
  req.post(
    `${urls.customer_search}/page/1`,
    {
      mobile: state.searchStr.trim(),
    },
    (d) => {
      state.loading = false;
      if (d.data.length == 0) {
        state.empty = true;
        state.serv_data = [];
        state.location_data = [];
        state.formData.mobile = state.searchStr;
        return;
      }
      state.client_data = d.data;
      state.location_data = d.addr;
      console.log(state.location_data);
      const serv_data = [];
      for (const k in d.services) serv_data.push(...d.services[k]);
      serv_data.forEach((e, i) => {
        const end_date = new Date(e.end_time);
        const expired = end_date < currentDate;
        const near = expired ? false : end_date - currentDate < 2678400000;
        serv_data[i] = { ...e, expired, near };
      });
      state.serv_data = serv_data;
      state.client_id = 0;
      state.local_id = 0;
      state.serv_id = 0;
    },
    (d) => {
      state.loading = false;
    }
  );
};

onMounted(() => {
  // getData();
});
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
</style>
<style>
.addr-selector .el-radio-group > div {
  width: 100%;
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
