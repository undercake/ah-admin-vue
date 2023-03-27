/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-03-03 17:20:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-27 17:26:45
 * @FilePath: /ah-main-admin/src/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from "vue";
import {
  ElMessageBox,
  ElButton,
  ElContainer,
  ElAside,
  ElMenu,
  ElSubMenu,
  ElMenuItemGroup,
  ElMenuItem,
  ElMessage,
  ElForm,
  ElFormItem,
  ElInput,
  ElCheckbox,
  ElPopover,
  ElTag,
  ElCard,
  ElTable,
  ElTableColumn,
  ElPopconfirm,
  ElUpload,
  ElDialog,
  ElPagination,
  ElCascader,
  ElRadioGroup,
  ElRadio,
  ElSelect,
  ElOption,
  ElScrollbar,
  ElDatePicker,
} from "element-plus";
import App from "./App.vue";
import router from "@/router";
import axios from "axios";
import { localSet, localGet } from "@/utils";
import mitt from "mitt";

let groups = [];

const BaseUri = "http://127.0.0.1:3000";
const urls = {
  BaseUri,
  captcha: BaseUri + "/midas/cap/get",
  login: BaseUri + "/midas/user/login",
  isLogged: BaseUri + "/midas/user/logged",
  logout: BaseUri + "/midas/user/logout",
  userProfile: BaseUri + "/midas/user/profile",
  upload_public: BaseUri + "/midas/uploader/public",
  upload_private: BaseUri + "/midas/uploader/private",
  getUserSideMenu: BaseUri + "/midas/user/getusersidemenu",
  admin_list: BaseUri + "/midas/admin/list",
  admin_all: BaseUri + "/midas/admin/all",
  admin_detail: BaseUri + "/midas/admin/detail",
  admin_add: BaseUri + "/midas/admin/add",
  admin_alter: BaseUri + "/midas/admin/alter",
  admin_delete: BaseUri + "/midas/admin/delete",
  admin_deleted: BaseUri + "/midas/admin/deleted",
  admin_deep_del: BaseUri + "/midas/admin/deep_del",
  admin_pass: BaseUri + "/midas/admin/pass",
  admin_rec: BaseUri + "/midas/admin/rec",
  group_list: BaseUri + "/midas/group/list",
  group_list_all: BaseUri + "/midas/group/all",
  group_detail: BaseUri + "/midas/group/detail",
  group_add: BaseUri + "/midas/group/add",
  group_alter: BaseUri + "/midas/group/alter",
  group_delete: BaseUri + "/midas/group/delete",
  employee_list: BaseUri + "/midas/employee/list",
  employee_detail: BaseUri + "/midas/employee/detail",
  employee_add: BaseUri + "/midas/employee/add",
  employee_alter: BaseUri + "/midas/employee/alter",
  employee_delete: BaseUri + "/midas/employee/delete",
  employee_deep_del: BaseUri + "/midas/employee/deep_del",
  employee_deleted: BaseUri + "/midas/employee/deleted",
  employee_rec: BaseUri + "/midas/employee/rec",
  services_list: BaseUri + "/midas/services/list",
  services_detail: BaseUri + "/midas/services/detail",
  services_add: BaseUri + "/midas/services/add",
  services_alter: BaseUri + "/midas/services/alter",
  services_delete: BaseUri + "/midas/services/delete",
  services_deep_del: BaseUri + "/midas/services/deep_del",
  services_deleted: BaseUri + "/midas/services/deleted",
  services_rec: BaseUri + "/midas/services/rec",
  services_category: BaseUri + "/midas/services/category",
  services_options: BaseUri + "/midas/services/options",
  services_opt_del: BaseUri + "/midas/services/opt_del",
  services_opt_add: BaseUri + "/midas/services/opt_add",
  services_opt_edit: BaseUri + "/midas/services/opt_edit",
  services_quick_edit: BaseUri + "/midas/services/quick_edit",
  rights_list: BaseUri + "/midas/group/rights",
};

const showMsg = {
  info(msg) {
    ElMessage({ showClose: true, message: msg });
  },
  warn(msg) {
    ElMessage({ showClose: true, message: msg, type: "warning" });
  },
  succ(msg) {
    ElMessage({ showClose: true, message: msg, type: "success" });
  },
  err(msg) {
    ElMessage({ showClose: true, message: msg, type: "error" });
  },
};
const mittBus = new mitt();
const handle200 = (succ, err, data) => {
  let d;
  if (data?.code !== undefined) d = data;
  else if (data?.data?.code !== undefined) d = data.data;
  if (d && d.code === 0) {
    succ(d);
  } else if (d && d.code !== 0) {
    err(d);
    showMsg.err(d.message);
    d.code === -2 && localSet("is_login", false);
    d.code === -2 && mittBus.emit("is_login", false);
  }
};
const handle_http_err = (e, err) => {
  err(e);
  if (e.response && e.response.status >= 500)
    showNetErr("服务器错误：" + e.response.status);
  else if (e.response && e.response.status >= 400)
    showNetErr("服务器资源错误：" + e.response.status);
  else if (error.response) showNetErr("请求错误：" + e.response.data.code);
};
const showNetErr = (e) =>
  ElMessage({ showClose: true, message: e, type: "error" });
const request = (method, url, succ, err, data = Object.create(null)) => {
  // console.log(method, data);
  axios[method](url, data)
    .then((data) => handle200(succ, err, data))
    .catch((e) => handle_http_err(e, err));
};
const upload = (url, file, prog, succ, err) =>
  axios
    .post(url, createFormData(file), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          prog(((progressEvent.loaded / progressEvent.total) * 100) | 0);
        }
      },
    })
    .then((res) => handle200(succ, err, res))
    .catch((e) => handle_http_err(e, err));

const createFormData = f=> {
  const fm = new FormData;
  const content_len = Math.round((f.size * 100) / 1024) / 100;
  fm.append("Content-Length", content_len);
  fm.append("file", f);
  return fm;
}


const req = {
  get($url, $fb, $err = () => {}) {
    request("get", $url, $fb, $err);
  },
  post($url, data, $fb, $err = () => {}) {
    request("post", $url, $fb, $err, data);
  },
  put($url, $data, $fb, $err = () => {}) {
    request("put", $url, $fb, $err, $data);
  },
  del($url, $fb = () => {}, $err = () => {}) {
    request("delete", $url, $fb, $err);
  },
  upload,
};

const getUserRights = (fun = () => {}) => {
  req.get(urls.getUserSideMenu, (data) => {
    let user_rights = [];
    const _rights = [];
    data.rights.forEach((r) => (_rights[r.id] = { ...r }));
    _rights.forEach((r) => {
      const { id, parent, type, path, name, icon, sort } = r;
      if (parent !== 0) {
        if (!user_rights[parent])
          user_rights[parent] = {
            ..._rights[parent],
            children: [
              {
                id,
                parent,
                type,
                path,
                name,
                icon,
                children: [{ id, parent, type, path, name, icon, sort }],
              },
            ],
          };
        else
          user_rights[parent].children.push({
            id,
            parent,
            type,
            path,
            name,
            icon,
            sort,
          });
      } else {
        if (!user_rights[r.id])
          user_rights[r.id] = {
            id,
            parent,
            type,
            path,
            icon,
            name,
            sort,
            children: [],
          };
      }
    });
    user_rights.forEach((d, i) => {
      user_rights[i].children.sort((a, b) => a.sort - b.sort);
    });
    user_rights.sort((a, b) => a.sort - b.sort);
    localSet("user_rights", user_rights);
    localSet("all_rights", data.rights);
    fun(user_rights);
    initRights(1);
  });
};

const hasRights = (p) => {
  groups.length < 1 && initRights();
  let $rtn = false;
  for (const k in groups) {
    if (groups[k].path == p) {
      $rtn = true;
      break;
    }
  }
  return $rtn;
};

const getRouteName = (p) => {
  groups.length < 1 && initRights();
  let $rtn = "阿惠管理后台";
  for (const k in groups) {
    if (groups[k].path == p) {
      $rtn = groups[k].name;
      break;
    }
  }
  return $rtn;
};

const initRights = (e = 0) => {
  if (groups.length > 1 && e === 0) return;
  const all_rights = localGet("all_rights", false);
  if (all_rights === false) return getUserRights(getRights);
  getRights();
};

const getRights = () => {
  groups = [{ path: "/index", name: "主页" }];
  const all_rights = localGet("all_rights");
  all_rights.forEach((e) => {
    if (!e) return;
    const { path, name } = e;
    groups.push({ path, name });
  });
};

const app = createApp(App); // 生成 Vue 实例 app
app.config.globalProperties.getUserRights = getUserRights;
app.config.globalProperties.showMsg = showMsg;
app.config.globalProperties.urls = urls;
app.config.globalProperties.req = req;
app.config.globalProperties.mittBus = mittBus;
app.config.globalProperties.hasRights = hasRights;
app.config.globalProperties.getRouteName = getRouteName;
app.config.globalProperties.goTop = () =>
  (document.querySelector(".main").scrollTop = 0);

app.use(router); // 引用路由实例
app
  .use(ElButton)
  .use(ElContainer)
  .use(ElAside)
  .use(ElMessageBox)
  .use(ElMenu)
  .use(ElSubMenu)
  .use(ElMenuItemGroup)
  .use(ElMessage)
  .use(ElMenuItem)
  .use(ElForm)
  .use(ElFormItem)
  .use(ElCheckbox)
  .use(ElInput)
  .use(ElPopover)
  .use(ElTag)
  .use(ElCard)
  .use(ElTable)
  .use(ElTableColumn)
  .use(ElPopconfirm)
  .use(ElUpload)
  .use(ElDialog)
  .use(ElPagination)
  .use(ElCascader)
  .use(ElRadioGroup)
  .use(ElRadio)
  .use(ElSelect)
  .use(ElOption)
  .use(ElDatePicker)
  .use(ElScrollbar);
app.mount("#app"); // 挂载到 #app
