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
          <el-button type="success" @click="handleQuickEdit(0, 1)">
            <i class="fa fa-solid fa-up"></i>
            批量上架
          </el-button>
          <el-button type="info" @click="handleQuickEdit(0, 0)">
            <i class="fa fa-solid fa-down"></i>
            批量下架
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
                批量删除</el-button
              >
            </template>
          </el-popconfirm>
          <el-button type="primary" @click="getData(state.currentPage)"
            ><i class="fa fa-solid fa-arrows-rotate"></i>刷新</el-button
          >
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
        <el-table-column prop="name" label="类目名称">
          <template #default="scope">
            <div class="cell cell-edit" v-if="scope.row.id == state.edit_cat">
              <el-input
                v-model="state.tmpChName"
                placeholder="请填写类目名称"
              />
              <el-button
                type="success"
                @click="
                  changeName(scope.row.id, state.tmpChName)
                "
              >
                确定
              </el-button>
              <el-button type="info" @click="cancelChangeName">
                取消
              </el-button>
            </div>
            <div class="cell" v-else>
              {{ scope.row.name }}
              <a
                style="cursor: pointer; margin-right: 10px"
                @click="handleEdit(scope.row.id, scope.row.name)"
              >
                修改
              </a>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="上架状态" width="130">
          <template #default="scope">
            <el-button
              style="width: 100%"
              @mouseleave="handle_hover(scope.$index, false)"
              @mouseenter="handle_hover(scope.$index, true)"
              v-if="scope.$index == state.hover_id"
              @click="
                handleQuickEdit(scope.row.id, scope.row.status == 1 ? 0 : 1)
              "
              :type="['success', 'danger'][scope.row.status]"
            >
              {{ "点击" + ["上架", "下架"][scope.row.status] }}
            </el-button>
            <el-button
              style="width: 100%"
              @mouseleave="handle_hover(scope.$index, false)"
              @mouseenter="handle_hover(scope.$index, true)"
              v-else
              :type="['danger', 'success'][scope.row.status]"
              plain
            >
              {{ ["已下架", "上架中"][scope.row.status] }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
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
        layout="prev, pager, next"
        v-if="state.total > 10"
        :total="state.total"
        :page-size="state.pageSize"
        :current-page="state.currentPage"
        @current-change="changePage"
      />
    </el-card>
  </Layout>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";

const { urls, showMsg, req } =
  getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
  tmpChName:'',
  hover_id: -1,
  edit_cat: -1,
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
    `${urls.services_category}/page/${page}`,
    (d) => {
      console.log(d);
      state.tableData = d.data;
      state.loading = false;
      state.firstLoading = false;
      state.currentPage = d.current_page;
      state.pageSize = d.count_per_page;
      state.total = d.count;
      state.empty = "没有数据";
    },
    (d) => {
      state.firstLoading = false;
      state.loading = false;
      state.empty = "加载错误";
      showMsg.err("加载错误");
    }
  );
};
const changePage = (val) => {
  state.currentPage = val;
  getData(val);
};
const handleAdd = () => (state.edit_cat = 0);
// 修改分类
const handleEdit = (id, name) => {
  state.edit_cat = id;
  state.tmpChName = name;
  console.log(id,name);
  };
const changeName = (id, name) =>
  req.post(urls.services_cat_name, { id, name }, (d) => {
    showMsg.succ("提交成功");
    getData();
    state.edit_cat = -1;
  }, o=>{
    console.log(o);
    state.edit_cat = -1});
// 选择项
const handleSelectionChange = (val) => (state.multipleSelection = val);
// 批量删除
const handleDelete = () => {
  console.log(state.multipleSelection.length);
  if (state.multipleSelection.length < 1)
    return showMsg.warn("您没有选择要删除的数据！");
  const ids = state.multipleSelection.map((d) => d.id);
  req.post(urls.services_cat_del, { ids }, () => getData());
};
const handleDeleteOne = (id) => {
  req.del(urls.services_cat_del + "/id/" + id, () => getData());
};
const handleQuickEdit = (id, newStatus) => {
  if (id === 0 && state.multipleSelection.length === 0)
    return showMsg.err(
      "您没有选择需要" + ["下架", "上架"][newStatus] + "的商品"
    );
  const afterQ = () => {
    showMsg.succ("更新成功！");
    getData();
  };
  id == 0
    ? req.post(
        urls.services_quick_ch_cat,
        {
          ids: state.multipleSelection.map((d) => d.id).toString(),
          status: newStatus,
        },
        afterQ
      )
    : req.post(urls.services_quick_ch_cat, { id, status: newStatus }, afterQ);
};
const cancelChangeName = () => {
  state.edit_cat = -1;
  state.tmpChName = '';
};
const handle_hover = (i, s) => (state.hover_id = s ? i : -1);
</script>

<style></style>
