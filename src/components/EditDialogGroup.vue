<template>
  <el-dialog
    :title="state.edit_id == 0 ? '添加角色' : '编辑角色'"
    width="40%"
    center
    :close-on-click-modal="false"
    :show-close="false"
    :model-value="true"
  >
    <template #header>
      <span role="heading" class="el-dialog__title"
        >{{ id == 0 ? "添加" : "编辑" }}服务</span
      >
      <button
        class="el-dialog__headerbtn"
        type="button"
        :disabled="state.disable_close"
        @click="handleClose"
      >
        <i class="el-icon el-dialog__close fa-solid fa-xmark-large fa-fw" />
      </button>
    </template>

    <el-skeleton :rows="5" animated v-if="state.load_all" />
    <el-form
      :model="state.ruleForm"
      :rules="rules"
      ref="formRef"
      label-width="100px"
      class="good-form"
      v-if="!state.load_all"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input type="text" v-model="state.ruleForm.name"></el-input>
      </el-form-item>
    </el-form>
    <el-skeleton :rows="3" animated v-if="state.group_load" />
    <el-scrollbar class="container" v-if="!state.group_load">
      <el-card class="box-card" v-for="item in state.right_list" :key="item.id">
        <template #header>
          <div class="card-header">
            <span>{{ item.name }}</span>
            <el-switch
              :model-value="state.rights_selected.has(item.id)"
              @change="(e) => switch_change(item.id, e)"
            />
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="12" v-for="o in item.children" :key="o.id">
            <span>{{ o.name }}</span>
            <el-tag
              class="mx-1"
              effect="plain"
              :type="o.type == 2 ? 'success' : ''"
              round
              v-if="o.type !== 0"
            >
              {{ ["API", "编辑"][o.type - 1] }}
            </el-tag>
            <span class="right">
              <el-switch
                :model-value="state.rights_selected.has(o.id)"
                @change="(e) => switch_change(o.id, e)"
              />
            </span>
          </el-col>
        </el-row>
        <span class="text item"> </span>
      </el-card>
    </el-scrollbar>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose" :disabled="state.disable_close">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submit_form"
          :disabled="state.disable_close"
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
import { reactive, onMounted, getCurrentInstance, ref } from "vue";

const rules = {
  name: [{ required: "true", message: "角色名不能为空", trigger: ["blur"] }],
};
</script>
<script setup>
const { urls, req, showMsg, hasRights } =
  getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits(["close", "reload"]);
const props = defineProps(["id"]);
const id = props["id"];
const formRef = ref();
const state = reactive({
  is_edit: false,
  group_load: false,
  load_all: false,
  disable_close: false,
  group_list: [],
  right_list: [],
  ruleForm: {
    name: "",
  },
  rights_selected: new Set([]),
});

onMounted(() => {
  get_rights();
  get_group_info();
});

const open = (id = 0) => {
  console.log(hasRights("/group/edit"));
  if (!hasRights("/group/edit")) return showMsg.err("您没有权限编辑此项目");
  state.is_edit = true;
  get_rights();
  if (id > 0) {
    id = id;
    get_group_info();
  }
};

const switch_change = (id, rs) => {
  console.log(id, rs);
  rs ? state.rights_selected.add(id) : state.rights_selected.delete(id);
  state.right_list.forEach((i) => {
    if (i.id === id) {
      i.children.forEach((d) => {
        rs
          ? state.rights_selected.add(d.id)
          : state.rights_selected.delete(d.id);
      });
    }
  });
};

const get_group_info = () => {
  if (id == 0) return;
  state.load_all = true;
  req.get(
    `${urls.group_detail}/id/${id}`,
    ({ detail }) => {
      state.ruleForm.name = detail.name;
      state.rights_selected.clear();
      detail.rights
        .split(",")
        .forEach((e) => state.rights_selected.add(parseInt(e)));
      console.log(detail, state.rights_selected);
      state.load_all = false;
    },
    handleClose
  );
};

const get_rights = () => {
  state.group_load = true;
  req.get(urls.rights_list, (d) => {
    const data = [];
    d.data.forEach(
      (r) => r.parent == 0 && (data[r.id] = { ...r, children: [] })
    );
    console.log(data);
    d.data.forEach((r) => {
      const { id, parent, type, path, name } = r;
      console.log({ id, parent, type, path, name });
      if (parent !== 0) {
        if (data[parent] === undefined)
          d.data.forEach(
            (a) => a.id == parent && (data[parent] = { ...a, children: [] })
          );
        if (data[parent]?.children === undefined)
          data[parent] = { ...data[parent], children: [] };
        data[parent].children.push({ id, parent, type, path, name });
      }
    });
    state.right_list = data.filter((e) => e);
    state.group_load = false;
  });
};

const submit_form = async () => {
  formRef.value.validate((valid, err) => {
    if (!valid) {
      for (const k in err) {
        showMsg.err(err[k][0].message);
        break;
      }
      return;
    }
    const { name } = state.ruleForm;
    const url = id == 0 ? urls.group_add : urls.group_alter;
    const method = id == 0 ? "post" : "put";
    req[method](
      url,
      {
        name,
        rights: Array.from(state.rights_selected).toString(),
        id: id,
      },
      (d) => {
        state.is_edit = false;
        state.disable_close = false;
        state.ruleForm = {
          name: "",
        };
        state.rights_selected.clear();
        showMsg.succ("提交成功！");
        emit("reload", true);
        handleClose(true);
      },
      (e) => {
        console.warn(e);
        state.disable_close = false;
      }
    );
  });
};
const handleClose = (e) => {
  emit("close", e);
};

// defineExpose({ open, close });
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.el-card {
  margin-top: 0.9rem;
}
.el-row {
  border-top: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}
.el-col {
  border: 1px solid #dcdfe6;
  border-top: none;
  border-left: none;
}
.el-card span {
  margin-right: 1rem;
  line-height: 2rem;
}
.el-card span.right {
  margin-right: 0;
  float: right;
}
.el-scrollbar {
  height: 400px;
}
</style>
