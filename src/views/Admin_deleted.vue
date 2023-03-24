<template>
  <Layout>
    <el-card class="category-container" v-loading="state.loading">
      <template #header>
        <div class="header">
          <el-button type="primary" @click="handleRec">
            <i class="fa fa-solid fa-rotate-right"></i>
            还原</el-button
          >
          <el-popconfirm
            title="确定删除吗？"
            confirmButtonText="确定"
            cancelButtonText="取消"
            @confirm="handleDeleteOne(0)"
          >
            <template #reference>
              <el-button type="danger">
                <i class="fa fa-solid fa-trash-can" />
                批量彻底删除</el-button
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
        <el-table-column type="selection"> </el-table-column>
        <el-table-column prop="full_name" label="姓名"> </el-table-column>
        <el-table-column prop="user_name" label="登录名"> </el-table-column>
        <el-table-column prop="group_name" label="角色名"> </el-table-column>
        <el-table-column prop="deleted" label="删除时间"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-popconfirm
              title="确定恢复吗？"
              confirmButtonText="确定"
              cancelButtonText="取消"
              @confirm="recover(scope.row.id)"
            >
              <template #reference>
                <a style="cursor: pointer; margin-right: 10px">恢复</a>
              </template>
            </el-popconfirm>
            <a style="cursor: pointer" @click="handleDeleteOne(scope.row.id)"
              >彻底删除</a
            >
          </template>
        </el-table-column>
      </el-table>
      <!--总数超过一页，再展示分页器-->
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="state.total"
        :disabled="state.tableData.length == 0"
        :page-size="state.pageSize"
        :current-page="state.currentPage"
        @current-change="getData"
      />
    </el-card>
    <EditDialogAdmin ref="editRef" @reload="getData(0)" />
  </Layout>
</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from "vue";
import { ElMessageBox } from "element-plus";
import Layout from "@/components/Layout.vue";
import EditDialogAdmin from "@/components/EditDialogAdmin.vue";

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
});
onMounted(() => {
  getData();
});
// 获取数据
const getData = (page = 0) => {
  if (page === 0) page = state.currentPage;
  state.loading = true;
  req.get(
    `${urls.admin_deleted}/page/${page}`,
    (d) => {
      state.tableData = d.data;
      state.loading = false;
      state.currentPage = d.current_page;
      state.pageSize = d.count_per_page;
      state.total = d.count;
      state.empty = "没有数据";
    },
    (d) => {
      console.log(d);
      state.loading = false;
      state.empty = "加载错误";
      showMsg.err("加载错误");
    }
  );
};
const handleAdd = () => {
  editRef.value.open(0);
};
// 修改分类
const recover = (id) =>
  req.post(urls.admin_rec, { id }, () => {
    getData();
  });
// 选择项
const handleSelectionChange = (val) => {
  state.multipleSelection = val;
};
// 批量删除
const handleRec = () => {
  const ids = state.multipleSelection.map((d) => d.id);
  req.post(urls.admin_rec, { ids }, () => getData());
};

const deep_delete = (id = 0) => {
  if (id === 0)
    req.post(urls.admin_deep_del, { ids: state.multipleSelection }, () => {
      showMsg.succ("成功删除！");
      getData();
    });
  req.del(urls.admin_deep_del + "/id/" + id, () => {
    showMsg.succ("成功删除！");
    getData();
  });
};

// // 单个删除
const handleDeleteOne = (id) => {
  console.log(id);
  if (id == 0 && state.multipleSelection.length < 1) return showMsg.warn('您没有选择数据！');
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
