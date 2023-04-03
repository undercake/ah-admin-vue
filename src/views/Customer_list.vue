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
            增加</el-button
          >
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
      <!-- 
  name
	3	mobile
	4	black
	5	pym
	6	pinyin
	7	del
	8	create_time
	9	last_modify
	10	remark
	11	total_money
	12	total_count
 -->
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
              effect="light"
              round
            >
              已拉黑
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="地址">
          <template #default="scope">
            <el-text truncated v-for="(item, index) in state.addr[scope.row.id]" :key="index">
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
        <el-table-column label="合同编号  到期时间">
          <template #default="scope">
            <p v-for="(item, index) in state.services[scope.row.id]" :key="index">
              <el-text truncated>
                {{ item.contract_code }}
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
import { h, onMounted, reactive, ref, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";
import EditDialogEmp from "@/components/EditDialogEmp.vue";

const editRef = ref(false);
const { urls, showMsg, req } =
  getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
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
  req.get(
    `${urls.customer_list}/page/${page}`,
    (d) => {
      d.addr.forEach(a=>state.addr[a.customer_id] ? state.addr[a.customer_id].push(a) : (state.addr[a.customer_id] = [a]));
      d.services.forEach(a=>state.services[a.customer_id] ? state.services[a.customer_id].push(a) : (state.services[a.customer_id] = [a]));
      console.log(state.addr, state.services);
      state.tableData = [...d.data];
      state.loading = false;
      state.firstLoading = false;
      state.currentPage = d.current_page;
      state.pageSize = d.count_per_page;
      state.total = d.count;
      state.empty = "没有数据";
    },
    (d) => {
      console.error(d);
      state.loading = false;
      state.firstLoading = false;
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

<style></style>
