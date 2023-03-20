/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-03-03 17:20:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-20 16:39:31
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
} from "element-plus";
import App from "./App.vue";
import router from "@/router";
import axios from "axios";
import { localSet, localGet } from "@/utils";
import mitt from "mitt";

let groups = [];

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
const showNetErr = (e) =>
  ElMessage({ showClose: true, message: "请求出现错误", type: "error" });
const request = (method, url, succ, err, data = Object.create(null)) => {
  // console.log(method, data);
  axios[method](url, data)
    .then((data) => {
      let d;
      if (data?.code !== undefined)
        d = data;
      else if(data?.data?.code !== undefined)
        d = data.data;
      if (d && d.code === 0) {
        succ(d);
      } else if (d && d.code !== 0) {
        err(d);
        showMsg.err(d.msg);
        d.code === -2 && localSet("is_login", false);
        d.code === -2 && mittBus.emit("is_login", false);
      }
    })
    .catch((e) => {
      showNetErr(e);
      console.error(e);
      err(e);
    })
    .finally();
};
const BaseUri = "http://127.0.0.1:3000";
const urls = {
  BaseUri,
  captcha        : BaseUri + "/midas/cap/get",
  login          : BaseUri + "/midas/user/login",
  isLogged       : BaseUri + "/midas/user/logged",
  logout         : BaseUri + "/midas/user/logout",
  userProfile    : BaseUri + "/midas/user/profile",
  getUserSideMenu: BaseUri + "/midas/user/getusersidemenu",
  admin_list     : BaseUri + "/midas/admin/list",
  admin_all      : BaseUri + "/midas/admin/all",
  admin_detail   : BaseUri + "/midas/admin/detail",
  admin_add      : BaseUri + "/midas/admin/add",
  admin_alter    : BaseUri + "/midas/admin/alter",
  admin_delete   : BaseUri + "/midas/admin/delete",
  admin_deleted  : BaseUri + "/midas/admin/deleted",
  admin_deep_del : BaseUri + "/midas/admin/deep_del",
  admin_pass     : BaseUri + "/midas/admin/pass",
  admin_rec      : BaseUri + "/midas/admin/rec",
  group_list     : BaseUri + "/midas/group/list",
  group_list_all : BaseUri + "/midas/group/all",
  group_detail   : BaseUri + "/midas/group/detail",
  group_add      : BaseUri + "/midas/group/add",
  group_alter    : BaseUri + "/midas/group/alter",
  group_delete   : BaseUri + "/midas/group/delete",
  rights_list    : BaseUri + "/midas/group/rights",
};

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
  del($url, $fb = ()=>{}, $err = () => {}) {
    request("delete", $url, $fb, $err);
  },
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
    user_rights.forEach((d,i) => {
      user_rights[i].children.sort((a,b) => a.sort - b.sort);
    })
    user_rights.sort((a,b) => a.sort - b.sort);
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
  .use(ElScrollbar);
app.mount("#app"); // 挂载到 #app
