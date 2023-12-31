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
            <i class="fa fa-solid fa-arrows-rotate"></i>刷新
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
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="name" label="角色名"> </el-table-column>
        <el-table-column prop="rights" label="权限">
          <template #default="scope">
            <el-text truncated>
              {{ scope.row.rights.split(",").length }} 项
            </el-text>
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
        @current-change="changePage"
      />
    </el-card>
    <EditDialogGroup :id="state.edit_id" v-if="state.edit_id >= 0" @reload="getData(0)" @close="handleEdit(-1)" />
  </Layout>
</template>

<script setup>
import { h, onMounted, reactive, ref, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";
import EditDialogGroup from "@/components/EditDialogGroup.vue";

const { urls, showMsg, req, mittBus, hasRights } =
  getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
  edit_id:-1,
  firstLoading: true,
  loading: true,
  tableData: [], // 数据列表
  multipleSelection: [], // 选中项
  total: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 20, // 分页大小
  type: "add", // 操作类型
  empty: "没有数据",
});
onMounted(() => {
  getData();
});
// 获取数据
const getData = (page = 0) => {
  if (page === 0) page = state.currentPage;
  state.loading = true;
  mittBus.emit("updateSideMenu", true);
  req.get(
    `${urls.group_list}/page/${page}`,
    (d) => {
      console.log(d);
      state.tableData = d.grp;
      state.loading = false;
      state.firstLoading = false;
      state.currentPage = d.current_page;
      state.pageSize = d.count_per_page;
      state.total = d.count;
      state.empty = "没有数据";
    },
    (d) => {
      state.loading = false;
      state.firstLoading = false;
      state.empty = "加载错误";
      showMsg.err("加载错误");
    }
  );
};
const changePage = (val) => {
  state.currentPage = val;
  getData(val);
};
// 修改分类
const handleEdit = (id) => {
  if (hasRights("/group/edit"))
    state.edit_id = id;
  else showMsg.err('您没有权限编辑此项目');
}
// 选择项
const handleSelectionChange = (val) => {
  state.multipleSelection = val;
};
// 批量删除
const handleDelete = () => {
  console.log(state.multipleSelection.length);
  if (state.multipleSelection.length < 1)
    return showMsg.warn("您没有选择要删除的数据！");
  const ids = state.multipleSelection.map((d) => d.id);
  req.post(urls.group_delete, { ids }, () => getData());
};
const handleDeleteOne = (id) => {
  req.del(urls.group_delete + "/id/" + id, () => getData());
};
</script>

<style></style>
