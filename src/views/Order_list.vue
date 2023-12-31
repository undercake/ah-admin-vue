<template>
  <layout>
    <el-card class="category-container" v-if="state.firstLoading">
      <el-skeleton :rows="8" animated />
    </el-card>
    <el-card
      class="category-container"
      v-if="!state.firstLoading"
      v-loading="state.loading"
    >
      <template #header>
        <div class="header">
          <el-button type="primary" @click="handleEdit(0)">
            <i class="fa fa-solid fa-plus"></i>
            增加
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            confirmButtonText="确定"
            cancelButtonText="取消"
            @confirm="handleDelete"
          >
            <template #reference>
              <el-button type="danger">
                <i class="fa fa-solid fa-trash-can" />
                批量删除
              </el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" @click="getData(state.currentPage)">
            <i class="fa fa-solid fa-arrows-rotate" />
            刷新
          </el-button>
          <el-input
            v-model="state.searchStr"
            class="search"
            size="large"
            placeholder="输入电话号查找"
            clearable
            @keydown.enter="getData(1)"
          />
          <el-button type="primary" @click="getData(1)">
            <i class="fa fa-solid fa-magnifying-glass" />
            搜索
          </el-button>
          <el-text class="list-total">共 {{ state.total }} 项</el-text>
        </div>
      </template>
      <el-table
        ref="multipleTable"
        :data="state.tableData"
        :empty-text="state.loading ? '数据加载中...' : state.empty"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column prop="name" label="姓名" width="130">
          <template #default="scope">
            {{ scope.row.name }}
            <el-tag
              v-if="scope.row.black == 1"
              type="danger"
              class="mx-1"
              effect="dark"
              round
            >
              已拉黑
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="130" />
        <el-table-column prop="remark" label="备注" width="130" />
        <el-table-column label="地址">
          <template #default="scope">
            <el-text
              truncated
              v-for="(item, index) in state.addr[scope.row.id]"
              :key="index"
              :alt="item.address"
            >
              {{ item.address }}
            </el-text>
          </template>
        </el-table-column>
        <el-table-column prop="last_modify" label="最后编辑时间" width="180">
          <template #default="scope">
            <el-text truncated>
              {{ scope.row.last_modify }}
            </el-text>
          </template>
        </el-table-column>
        <el-table-column label="类型 合同编号 到期时间" width="340">
          <template #default="scope">
            <p
              v-for="(item, index) in state.services[scope.row.id]"
              :key="index"
              style="text-align: left"
            >
              <el-text truncated>
                <el-tag
                  :type="
                    [
                      'info',
                      'info',
                      '',
                      '',
                      'success',
                      'success',
                      'success',
                      '',
                    ][item.type]
                  "
                  class="mx-1"
                  effect="dark"
                >
                  {{
                    [
                      "暂无",
                      "钟点",
                      "包周",
                      "包做",
                      "年卡",
                      "季卡",
                      "月卡",
                      "半月卡",
                    ][item.type]
                  }}
                </el-tag>
              </el-text>
              <el-text truncated style="margin-left: 0.5rem">
                {{ item.contract_code }}
              </el-text>
              <el-text
                truncated
                style="margin-left: 0.5rem"
                v-if="item.type != 0 && item.type != 1"
              >
                <el-tag
                  :type="
                    item.expired ? 'danger' : item.near ? 'warning' : 'success'
                  "
                  class="mx-1"
                  effect="dark"
                >
                  {{ item.expired ? "已" : item.near ? "临近" : "未" }}过期
                </el-tag>
                {{ item.end_time }}
              </el-text>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <a
              style="cursor: pointer; margin-right: 10px"
              @click="handleEdit(scope.row.id)"
            >
              修改
            </a>
            <el-popconfirm
              title="确定删除吗？"
              confirmButtonText="确定"
              cancelButtonText="取消"
              @confirm="handleDeleteOne(scope.row.id)"
            >
              <template #reference>
                <a style="cursor: pointer">删除</a>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!--总数超过一页，再展示分页器-->
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        v-if="state.total > 10"
        :disabled="state.tableData.length == 0"
        :total="state.total"
        :page-size="state.pageSize"
        :current-page="state.currentPage"
        @current-change="getData"
      />
    </el-card>
    <edit-dialog-emp
      v-if="state.edit_id > -1"
      :id="state.edit_id"
      @closed="handleClosed"
      @reload="getData(0)"
    />
  </layout>
</template>
<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";
import EditDialogEmp from "@/components/EditDialogEmp.vue";

const { urls, showMsg, req, hasRights } =
  getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
  edit_id: -1,
  searchStr: "",
  addr: [],
  services: [],
  firstLoading: true,
  loading: true,
  tableData: [], // 数据列表
  multipleSelection: [], // 选中项
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 10, // 分页大小
  type: "add", // 操作类型
  level: 1,
  parent_id: 0,
  empty: "没有数据",
});
onMounted(() => {
  getData();
});
// 获取数据
const getData = (page = 0) => {
  state.edit_id = -1;
  if (page === 0) page = state.currentPage;
  state.loading = true;
  const currentDate = new Date();
  const processData = (d) => {
    state.addr = [];
    state.services = d.services;
    d.addr.forEach((a) => {
      state.addr[a.customer_id]
        ? state.addr[a.customer_id].push(a)
        : (state.addr[a.customer_id] = [a]);
    });
    for (const i in state.services) {
      const s = state.services[i];
      if (!s || s.length == 0) return;
      const pros_data = (e, k) => {
        const end_date = new Date(e.end_time);
        const expired = end_date < currentDate;
        const near = expired ? false : end_date - currentDate < 2678400000;
        state.services[i][k] = { ...e, expired, near };
      };
      s && s.forEach(pros_data);
      s.sort((a, b) => new Date(b.end_time) - new Date(a.end_time));
    }
    state.tableData = [...d.data];
    state.loading = false;
    state.firstLoading = false;
    state.currentPage = d.current_page;
    state.pageSize = d.count_per_page;
    state.total = d.count;
    state.empty = "没有数据";
    console.log(state);
  };
  const handleErr = (d) => {
    console.error(d);
    state.loading = false;
    state.firstLoading = false;
    state.empty = "加载错误";
  };
  if (state.searchStr.trim() == "")
    req.get(`${urls.customer_list}/page/${page}`, processData, handleErr);
  else
    req.post(
      `${urls.customer_search}/page/${page}`,
      {
        mobile: state.searchStr.trim(),
      },
      processData,
      handleErr
    );
};
// 修改分类
const handleEdit = (id) => {
  if (!hasRights("/customer/edit")) return showMsg.err("您没有权限编辑此项目");
  state.edit_id = id;
}
// 选择项
const handleClosed = ()=> state.edit_id = -1;
const handleSelectionChange = (val) => (state.multipleSelection = val);
// 批量删除
const handleDelete = () => {
  console.log(state.multipleSelection.length);
  if (state.multipleSelection.length < 1)
    return showMsg.warn("您没有选择要删除的数据！");
  const ids = state.multipleSelection.map((d) => d.id);
  req.post(urls.customer_delete, { ids }, () => getData());
};
// // 单个删除
const handleDeleteOne = (id) => {
  req.del(urls.customer_delete + "/id/" + id, () => getData());
};
</script>

<style scoped>
.search {
  width: 12rem;
  margin: 0 0.6rem;
}
</style>
