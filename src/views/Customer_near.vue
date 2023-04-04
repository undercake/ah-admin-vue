<template>
  <Layout>
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
          <el-button type="primary" @click="handleAdd">
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
        <el-table-column label="类型 合同编号 到期时间" width="400">
          <template #default="scope">
            <div style="text-align: left">
              <p
              v-for="(item, index) in state.services[scope.row.id]" :key="index"
                style="text-align: left"
                :class="item.type == 0 || item.type == 1 ? 'p-inline' : ''"
              >
                <el-text truncated>
                  合同{{ index + 1 }}
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
                <el-text
                  truncated
                  style="margin-left: 0.5rem; width: 45px"
                  v-if="item.contract_code.length <= 5 && item.type != 0 && item.type != 1 "
                >
                  {{ item.contract_code }}
                </el-text>
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="item.contract_code"
                  placement="bottom"
                  v-else-if="item.type != 0 && item.type != 1"
                >
                  <el-text truncated style="margin-left: 0.5rem; width: 45px">
                    {{ item.contract_code }}
                  </el-text>
                </el-tooltip>
                <el-text
                  truncated
                  style="margin-left: 0.5rem"
                  v-if="item.type != 0 && item.type != 1"
                >
                  <el-tag
                    :type="
                      item.expired
                        ? 'danger'
                        : item.near
                        ? 'warning'
                        : 'success'
                    "
                    class="mx-1"
                    effect="dark"
                  >
                    {{ item.expired ? "已" : item.near ? "即将" : "未" }}过期
                  </el-tag>
                  {{ item.end_time }}
                </el-text>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <a
              style="cursor: pointer; margin-right: 10px"
              @click="handleEdit(scope.row.id)"
              >修改</a
            >
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
        :disabled="state.tableData.length == 0"
        :total="state.total"
        :page-size="state.pageSize"
        :current-page="state.currentPage"
        @current-change="getData"
      />
    </el-card>
    <EditDialogEmp ref="editRef" @reload="getData(0)" />
  </Layout>
</template>
<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";
import EditDialogEmp from "@/components/EditDialogEmp.vue";

const editRef = ref(false);
const { urls, showMsg, req } =
  getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
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
  if (page === 0) page = state.currentPage;
  state.loading = true;
  const currentDate = new Date();
  const prosessData = (d) => {
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
        }
      console.log(s);
      console.log(typeof(s))
        s && s.forEach(pros_data);
        s.sort((a,b) => (new Date(b.end_time))-(new Date(a.end_time)));
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
  req.get(`${urls.customer_near}/page/${page}`, prosessData, handleErr);
};
const handleAdd = () => {
  editRef.value.open(0);
};
// 修改分类
const handleEdit = (id) => editRef.value.open(id);
// 选择项
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
.cell p {
  margin: 0;
  padding: 5px 0;
}
.cell p + p {
  border-top: 1px solid var(--el-border-color);
}
.cell p.p-inline {
  display: inline-block;
  border: none !important;
  height: 1rem;
  padding-right: .5rem;
}
</style>
