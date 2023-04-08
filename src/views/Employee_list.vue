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
            <i class="fa fa-solid fa-arrows-rotate"></i>刷新
          </el-button>
          <el-input
            v-model="state.searchStr"
            class="search"
            size="large"
            placeholder="请输入电话、拼音码、拼音、姓名查找"
            clearable
            @keydown.enter="getData(1)"
          />
          <el-button type="primary" @click="getData(1)">
            <i class="fa fa-solid fa-magnifying-glass" />
            搜索
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
            <el-avatar
              shape="square"
              size="large"
              v-if="scope.row.avatar.length > 5"
              :src="scope.row.avatar"
            />
          </template>
        </el-table-column>
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
        <el-table-column prop="age" label="年龄" width="60"> </el-table-column>
        <el-table-column prop="grade" label="学历" width="80">
          <template #default="scope">
            {{
              [
                "",
                "小学",
                "初中",
                "高中",
                "中专",
                "技校",
                "大专",
                "本科",
                "硕士",
                "博士",
              ][scope.row.grade]
            }}
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
    <edit-dialog-emp
      v-if="state.edit_id > -1"
      :id="state.edit_id"
      @closed="handleClosed"
      @reload="getData(0)"
    />
  </layout>
</template>

<script setup>
import { h, onMounted, reactive, ref, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";
import EditDialogEmp from "@/components/EditDialogEmp.vue";

const { urls, showMsg, req, hasRights } =
  getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
  edit_id: -1,
  searchStr: "",
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
  const current_date = new Date();
  const handle_succ = (d) => {
    state.tableData = d.data;
    state.tableData.forEach((t, i) => {
      const age =
        t.birth_date.trim() == "" || t.birth_date == "0000-00-00"
          ? ""
          : parseInt((current_date - new Date(t.birth_date)) / 31557600000);
      state.tableData[i] = { ...t, age };
    });
    state.loading = false;
    state.firstLoading = false;
    state.currentPage = d.current_page;
    state.pageSize = d.count_per_page;
    state.total = d.count;
    state.empty = "没有数据";
  };
  const handle_fail = (d) => {
    console.log(d);
    console.error(d);
    state.loading = false;
    state.firstLoading = false;
    state.empty = "加载错误";
    // showMsg.err('加载错误')
  };
  state.searchStr.trim() == ""
    ? req.get(`${urls.employee_list}/page/${page}`, handle_succ, handle_fail)
    : req.post(
        `${urls.employee_search}/page/${page}`,
        { search: state.searchStr },
        handle_succ,
        handle_fail
      );
};
// 修改分类
const handleEdit = (id) => {
  if (!hasRights("/employee/edit")) return showMsg.err("您没有权限编辑此项目");
  state.edit_id = id;
}
// editRef.value.open(id);
const handleClosed = () => (state.edit_id = -1);
// 选择项
const handleSelectionChange = (val) => (state.multipleSelection = val);
// 批量删除
const handleDelete = () => {
  console.log(state.multipleSelection.length);
  if (state.multipleSelection.length < 1)
    return showMsg.warn("您没有选择要删除的数据！");
  const ids = state.multipleSelection.map((d) => d.id);
  req.post(urls.employee_delete, { ids }, () => getData());
};
// // 单个删除
const handleDeleteOne = (id) => {
  req.del(urls.employee_delete + "/id/" + id, () => getData());
};
</script>

<style scoped>
.search {
  width: 17rem;
  margin: 0 0.6rem;
}
</style>
