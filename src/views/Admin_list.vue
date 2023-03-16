<template>
  <Layout>
    <el-card class="category-container">
      <template #header>
        <div class="header">
          <el-button type="primary" :icon="Plus" @click="handleAdd"
            >增加</el-button
          >
          <el-popconfirm
            title="确定删除吗？"
            confirmButtonText="确定"
            cancelButtonText="取消"
            @confirm="handleDelete"
          >
            <template #reference>
              <el-button type="danger" :icon="Delete">批量删除</el-button>
            </template>
          </el-popconfirm>
        </div>
        <span @click="getData(state.currentPage)" class="right">
          <i class="fa-solid fa-arrows-rotate"></i>
        </span>
      </template>
      <el-table
        lazy
        v-loading="state.loading"
        element-loading-text="数据加载中..."
        element-loading-background="rgba(122, 122, 122, 0.8)"
        ref="multipleTable"
        :data="state.tableData"
        :empty-text="state.loading ? '数据加载中...' : '没有数据'"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="full_name" label="姓名"> </el-table-column>
        <el-table-column prop="user_name" label="登录名"> </el-table-column>
        <el-table-column prop="group_name" label="角色名"> </el-table-column>
        <el-table-column prop="mobile" label="手机号"> </el-table-column>
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
        layout="prev, pager, next"
        :total="state.total"
        :page-size="state.pageSize"
        :current-page="state.currentPage"
        @current-change="changePage"
      />
    </el-card>
    <AdminEditDialog ref="editRef" :reload="getData" />
  </Layout>
</template>

<script setup>
import { h, onMounted, reactive, ref, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";
import AdminEditDialog from "@/components/AdminEditDialog.vue";

//图标
const Plus = h("i", { class: "fa-solid fa-plus" });
const Delete = h("i", { class: "fa-solid fa-trash-can" });

const editRef = ref(false);
const { urls, showMsg, req } = getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
  loading: true,
  tableData: [], // 数据列表
  multipleSelection: [], // 选中项
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 20, // 分页大小
  type: "add", // 操作类型
  level: 1,
  parent_id: 0
});
onMounted(() => {
  getData();
});
// 获取数据
const getData = (page = 1) => {
  if (page === 0) page = state.page;
  state.loading = true;
  req.get(
    `${urls.admin_list}/page/${page}`,
    (d) => {
      console.log(d);
      state.tableData = d.data;
      state.loading = false;
    },
    (d) => console.warn(d)
  );
};
const changePage = (val) => {
  state.currentPage = val;
  getData();
};
// const handleNext = (item) => {
//   const levelNumber = item.categoryLevel + 1;
//   if (levelNumber == 4) {
//     ElMessage.error("没有下一级");
//     return;
//   }
// };
// 添加分类
const handleAdd = () => {
  console.log(editRef);
  console.log(editRef.value);
  console.log(editRef.value.open);
  editRef.value.open(0)
};
// 修改分类
const handleEdit = (id) => editRef.value.open(id);
// 选择项
const handleSelectionChange = (val) => {
  state.multipleSelection = val;
};
// 批量删除
const handleDelete = () => {
//   if (!state.multipleSelection.length) {
//     ElMessage.error("请选择项");
//     return;
  }
//   axios
//     .delete("/categories", {
//       data: {
//         ids: state.multipleSelection.map((i) => i.categoryId),
//       },
//     })
//     .then(() => {
//       ElMessage.success("删除成功");
//       getCategory();
//     });
// };
// // 单个删除
const handleDeleteOne = (id) => {
//   axios
//     .delete("/categories", {
//       data: {
//         ids: [id],
//       },
//     })
//     .then(() => {
//       ElMessage.success("删除成功");
//       getCategory();
//     });
};
</script>

<style></style>
