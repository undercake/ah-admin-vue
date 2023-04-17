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
          <el-button type="primary" @click="exportData">
            <i class=" fa fa-solid fa-file-export" />
            导出 Excel
          </el-button>
          <el-button type="primary" @click="getData(state.currentPage)" :disabled="state.searchLoading" :loading="state.searchLoading">
            <i class="fa fa-solid fa-arrows-rotate" />刷新
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
          <el-text class="search">
            每页显示：
            <el-input-number
              v-model="state.pageSize"
              :min="5"
              :max="200"
              @change="changeCount"
            />
          </el-text>
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

<script>
import { h, onMounted, reactive, ref, getCurrentInstance } from "vue";
import Layout from "@/components/Layout.vue";
import EditDialogEmp from "@/components/EditDialogEmp.vue";
import * as XLSX from 'xlsx';
let timer = 0;
</script>

<script setup>
const { urls, showMsg, req, hasRights } =
  getCurrentInstance().appContext.config.globalProperties;
const state = reactive({
  edit_id: -1,
  searchStr: "",
  firstLoading: true,
  loading: true,
  tableData: [], // 数据列表
  multipleSelection: [], // 选中项
  c: 0, // 总条数
  currentPage: 1, // 当前页
  pageSize: 20, // 分页大小
  type: "add", // 操作类型
  level: 1,
  parent_id: 0,
  empty: "没有数据",
  searchLoading: false,
  exportLoading: false
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
  };0
  const _item = state.pageSize == 10 ? '' : '/item/' + state.pageSize;
  state.searchStr.trim() == ""
    ? req.get(`${urls.employee_list}/page/${page}${_item}`, handle_succ, handle_fail)
    : req.post(
        `${urls.employee_search}/page/${page}${_item}`,
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

const changeCount = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    getData();
  }, 1500);
}

const exportData = ()=>{
  if (state.multipleSelection.length < 1)
    return showMsg.warn("您没有选择要导出的数据！");
  state.exportLoading = true;
  state.searchLoading = true;
  const data = state.multipleSelection.map(a => {
    const {id, name, phone, id_code, birth_date, address, workee, note } = a;
    return [id, name, phone, address,  id_code, birth_date == '0000-00-00' ? '' : birth_date, workee, note];
  });
  data.unshift(['ID', '姓名', '电话', '地址', '身份证号码', '出生年月', '工作内容', '备注']);
  const worksheet = XLSX.utils.aoa_to_sheet(data, {});

  let widths = [];
  data.forEach(w=>w.forEach((o, i) => {
    let valueWidth = 10;
    if (/.*[\u4e00-\u9fa5]+.*$/.test(o)) {
        valueWidth = parseFloat('' + `${o}`.length * 2.15);
      } else {
        valueWidth = parseFloat('' + `${o}`.length * 1.15);
      }
      let oldWdith = 0;
      if (widths[i]?.wch)
        oldWdith = widths[i].wch;
      widths[i] = {wch: Math.max(valueWidth, oldWdith)};
  }));
  worksheet["!cols"] = widths;
  const border = {
    top: {
      style: 'thin',
    },
    bottom: {
      style: 'thin',
    },
    left: {
      style: 'thin',
    },
    right: {
      style: 'thin',
    }
  }


  const alpha = ['A1','B1','C1','D1','E1','F1','G1','H1','I1','J1','K1','L1','M1','N1','O1','P1','Q1','R1','S1','T1'];

  for (const key in worksheet) {
    const o = worksheet[key].v;
    if (key.indexOf('!') > -1) continue;
    let s = {border}
    if (alpha.includes(key)) s = {border, font:{bold:true}, alignment: {
      horizontal: 'center',
      vertical: 'center'
    }}
    worksheet[key] = { ...worksheet[key], s };
  }

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, '0');
  XLSX.writeFile(workbook, `员工信息-${state.currentPage}.xlsx`);
  console.log(worksheet, XLSX.utils);

  state.exportLoading = false;
  state.searchLoading = false;
}
</script>

<style scoped>
.search {
  width: 17rem;
  margin: 0 0.6rem;
}
</style>
