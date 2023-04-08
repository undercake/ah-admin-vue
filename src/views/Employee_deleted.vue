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
          <el-button type="primary" @click="handleRec">
            <i class="fa fa-solid fa-rotate-right"></i>
            还原
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            confirmButtonText="确定"
            cancelButtonText="取消"
            @confirm="handleDeleteOne(0)"
          >
            <template #reference>
              <el-button type="danger">
                <i class="fa fa-solid fa-trash-can" />
                批量彻底删除
              </el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" @click="getData(state.currentPage)">
            <i class="fa fa-solid fa-arrows-rotate" />刷新
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
        <el-table-column prop="name" label="姓名" width="80" />
        <el-table-column prop="gender" label="性别" width="60">
          <template #default="scope">
            {{ ["男", "女"][scope.row.gender] }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="130">
          <template #default="scope">
            {{ scope.row.phone.split(",")[0] }}
          </template>
        </el-table-column>
        <el-table-column prop="origin" label="籍贯" width="170" />
        <el-table-column prop="address" label="现住址" />
        <el-table-column prop="intro" label="简介" />
        <el-table-column prop="note" label="备注" width="130" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <a
              style="cursor: pointer; margin-right: 10px"
              @click="handleRec(scope.row.id)"
              >恢复</a
            >
            <el-popconfirm
              title="确定删除吗？"
              confirmButtonText="确定"
              cancelButtonText="取消"
              @confirm="handleDeleteOne(scope.row.id)"
            >
              <template #reference>
                <a style="cursor: pointer"> 删除 </a>
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
  </layout>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";

const { urls, showMsg, req } =
  getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
  firstLoading: true,
  loading: true,
  tableData: [], // 数据列表
  multipleSelection: [], // 选中项
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 20, // 分页大小
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
  req.get(
    `${urls.employee_deleted}/page/${page}`,
    (d) => {
      state.tableData = d.data;
      state.loading = false;
      state.firstLoading = false;
      state.currentPage = d.current_page;
      state.pageSize = d.count_per_page;
      state.total = d.count;
      state.empty = "没有数据";
    },
    (d) => {
      console.log(d);
      console.error(d);
      state.loading = false;
      state.firstLoading = false;
      state.empty = "加载错误";
    }
  );
};
const handleRec = (id = 0) => {
  const ids = state.multipleSelection.map((d) => d.id);
  const data = id === 0 ? { ids } : { id };
  req.post(urls.employee_rec, data, () => getData());
};

const deep_delete = (id = 0) => {
  if (id === 0)
    req.post(urls.employee_deep_del, { ids: state.multipleSelection }, () => {
      showMsg.succ("成功删除！");
      getData();
    });
  req.del(urls.employee_deep_del + "/id/" + id, () => {
    showMsg.succ("成功删除！");
    getData();
  });
};
// 选择项
const handleSelectionChange = (val) => {
  state.multipleSelection = val;
};

// // 单个删除
const handleDeleteOne = (id) => {
  console.log(id);
  if (id == 0 && state.multipleSelection.length < 1)
    return showMsg.warn("您没有选择数据！");
  ElMessageBox.confirm("此操作将会不可逆删除！请确认您的删除对象", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => deep_delete(id))
    .catch((e) => console.log(e));
};
</script>

<style></style>
