<template>
  <el-dialog
    v-if="state.is_edit"
    v-model="state.is_edit"
    :title="state.edit_id == 0 ? '添加角色' : '编辑角色'"
    width="30%"
    center
    :close-on-click-modal="false"
    :show-close="!state.disable_close"
  >
    <el-form
      :model="state.ruleForm"
      :rules="state.rules"
      ref="formRef"
      label-width="100px"
      class="good-form"
      v-loading="state.load_all"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input type="text" v-model="state.ruleForm.name"></el-input>
      </el-form-item>
    </el-form>
    <el-skeleton :rows="3" animated v-if="state.group_load" />
    <div class="container" v-if="!state.group_load">
      <el-card class="box-card" v-for="item in state.right_list" :key="item.idi">
        <template #header>
          <div class="card-header">
            <span>{{ item.name }}</span>
            <el-switch
              :model-value="state.rights_selected.has(item.id)"
              @change="e=>switch_change(item.id, e)"
            />
          </div>
        </template>
          <el-row :gutter="20">
            <el-col :span="12" v-for="o in item.children" :key="o.id">
              <span>{{ o.name }}</span>
              <el-tag
                class="mx-1"
                effect="light"
                round
                v-if="o.type !== 0"
              >
                {{ ['API', '编辑'][o.type - 1] }}
              </el-tag>
              <span class="right">
                <el-switch
                  :model-value="state.rights_selected.has(o.id)"
                  @change="e=>switch_change(o.id, e)"
                />
              </span>
            </el-col>
          </el-row>
        <span class="text item">
        </span>
      </el-card>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close" :disabled="state.disable_close"
          >取消</el-button
        >
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
<script setup>
import { reactive, onMounted, getCurrentInstance, ref } from "vue";

const { urls, req, showMsg, hasRights } =
  getCurrentInstance().appContext.config.globalProperties;
const emit = defineEmits();
onMounted(() => {
});
const formRef = ref(null);
const state = reactive({
  id: -1,
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
  rules: {
    name: [{ required: "true", message: "角色名不能为空", trigger: ["blur"] }],
  },
});

const open = (id = 0) => {
  console.log(hasRights("/group/edit"));
  if (!hasRights("/group/edit")) return showMsg.err("您没有权限编辑此项目");
    state.is_edit = true;
    get_rights();
  if (id > 0) {
    state.id = id;
    get_group_info();
  }
};

const switch_change = (id,rs) => {
  console.log(id,rs);
  rs ? state.rights_selected.add(id) : state.rights_selected.delete(id);
  state.right_list.forEach((i) => {
    if (i.id === id) {
      i.children.forEach(d => {
        rs ? state.rights_selected.add(d.id) : state.rights_selected.delete(d.id);
      })
    }
  });
}

const close = () => (state.is_edit = false);

const get_group_info = () => {
  state.load_all = true;
  const id = state.id;
  req.get(`${urls.group_detail}/id/${id}`, ({ detail }) => {
    state.ruleForm.name = detail.name;
    state.rights_selected.clear();
    detail.rights.split(',').forEach(e => state.rights_selected.add(parseInt(e)));
    console.log(detail, state.rights_selected);
    state.load_all = false;
  });
};

const get_rights = () => {
  state.group_load = true;
  req.get(urls.rights_list, (d) => {
    const data = [];
    d.data.forEach(r=>r.parent == 0 && (data[r.id] = {...r, children: []}));
    console.log(data);
    d.data.forEach((r) => {
      const { id, parent, type, path, name } = r;
      console.log({ id, parent, type, path, name });
      if (parent !== 0) {
        data[parent].children.push({ id, parent, type, path, name });
      }
    });
    state.right_list = data.filter(e => e);
    state.group_load = false;
    console.log(state.right_list);
  },console.log);
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
    const url = state.id == 0 ? urls.group_add : urls.group_alter;
    const method = state.id == 0 ? "post" : "put";
    req[method](
      url,
      { name, rights: (Array.from(state.rights_selected).toString()), id: state.id },
      (d) => {
        state.is_edit = false;
        state.disable_close = false;
        state.ruleForm = {
          name: "",
        };
        state.rights_selected.clear();
        state.id = -1;
        showMsg.succ("提交成功！");
        emit("reload", true);
      },
      (e) => {
        console.warn(e);
        state.disable_close = false;
      }
    );
  });
};

defineExpose({ open, close });
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
.el-card {
  margin-top: .9rem;
}
.el-row {
  border-top: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
}
.el-col{
  border: 1px solid #dcdfe6;
  border-top: none;
  border-left: none;
}
.el-card span{
  margin-right: 1rem;
  line-height: 2rem;
}
.el-card span.right{
  margin-right: 0;
  float: right;
}
</style>
