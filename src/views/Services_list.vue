<template>
  <Layout>
    <el-card class="category-container" v-loading="state.loading">
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
            <i class="fa fa-solid fa-arrows-rotate"></i>
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
        <el-table-column prop="avatar" label="头像" width="100">
          <template #default="scope">
            <el-avatar shape="square" size="large" :src="scope.row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="服务名称" width="200" />
        <el-table-column prop="intro" label="服务简介" width="">
        </el-table-column>
        <el-table-column prop="class_id" label="服务类目" width="130">
          <template #default="scope">
            {{ state.category[scope.row.class_id] }}
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
        :disabled="state.tableData.length == 0"
        :total="state.total"
        :page-size="state.pageSize"
        :current-page="state.currentPage"
        @current-change="getData"
      />
    </el-card>
    <EditDialogServ ref="editRef" @reload="getData(0)" />
  </Layout>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";
import EditDialogServ from "@/components/EditDialogServ.vue";

const editRef = ref(false);
const { urls, showMsg, req } =
  getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
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
  category: [],
});
onMounted(() => {
  getData();
});
// 获取数据
const getData = (page = 0) => {
  if (page === 0) page = state.currentPage;
  state.loading = true;
  req.get(urls.services_category, (d) => {
    console.log(d);
    const tmpData = [];
    d.data.forEach((i) => (tmpData[i.id] = i.name));
    state.category = tmpData;
    console.log(tmpData);
  });
  req.get(
    `${urls.services_list}/page/${page}`,
    (d) => {
      console.log(d);
      state.tableData = d.data;
      state.loading = false;
      state.currentPage = d.current_page;
      state.pageSize = d.count_per_page;
      state.total = d.count;
      state.empty = "没有数据";
    },
    (d) => {
      console.log(d);
      console.error(d);
      state.loading = false;
      state.empty = "加载错误";
      // showMsg.err('加载错误')
    }
  );
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
};
// // 单个删除
const handleDeleteOne = (id) => {
  req.del(urls.services_delete + "/id/" + id, () => getData());
};
</script>

<style></style>