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
      <div v-if="!state.empty">
        <div class="text item">姓名：{{ state.client_data.name }}</div>
        <div class="text item">电话：{{ state.client_data.mobile }}</div>
        <div class="text item">
          剩余金额：{{ state.client_data.total_money }} 元
        </div>
        <div class="text item">
          剩余次数：{{ state.client_data.total_count }} 次
        </div>
        <div class="text item">备注：{{ state.client_data.remark }}</div>

        <div v-if="state.location_data.length > 0">
          选择地址：
          <el-radio-group v-model="state.local" size="large">
            <el-radio-button
              :label="item.id"
              v-for="(item, index) in state.location_data"
              :key="index"
              @click="() => (state.local_id = item.id)"
            >
              面积：{{ item.area }}
              地址：{{ item.address }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div v-if="state.serv_data.length > 0" style="margin-top: 10px">
          选择服务项目：
          <el-radio-group v-model="state.serv" size="large">
            <el-radio-button
              :label="item.id"
              v-for="(item, index) in state.serv_data"
              :key="index"
              @click="() => (state.serv_id = item.id)"
            >
              <el-tag
                :type="serv_type_color[item.type]"
                class="mx-1"
                effect="dark"
              >
                {{ serv_types[item.type] }}
              </el-tag>
              <el-text truncated style="margin-left: 0.5rem">
                {{ item.contract_code }}
              </el-text>
              <el-text
                truncated
                style="margin-left: 0.5rem"
                v-if="item.type != 1"
              >
                <el-tag
                  :type="
                    item.expired ? 'danger' : item.near ? 'warning' : 'success'
                  "
                  class="mx-1"
                  effect="dark"
                >
                  {{ item.expired ? "已" : item.near ? "即将" : "未" }}过期
                </el-tag>
                {{ item.end_time }}
              </el-text>
              <el-text> {{ item.remark }} </el-text>
            </el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div v-else>
        
      </div>
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
  local_id: 0,
  serv_id: 0,
  local: "",
  serv: "",
  client_data: {},
  location_data: [],
  serv_data: [],
  formData: {
    name: "",
    remark: "",
    mobile: "",
  },
});

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
      state.client_data = d.data[0];
      state.location_data = d.addr;
      const serv_data = [];
      for (const k in d.services) serv_data.push(...d.services[k]);
      serv_data.forEach((e, i) => {
        const end_date = new Date(e.end_time);
        const expired = end_date < currentDate;
        const near = expired ? false : end_date - currentDate < 2678400000;
        serv_data[i] = { ...e, expired, near };
      });
      state.serv_data = serv_data;
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
</style>
<style>
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
  text-align: left;
  width: 100%;
  border-left: none;
  border: none;
}
</style>
