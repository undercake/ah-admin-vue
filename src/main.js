/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-03-03 17:20:58
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-03-16 17:20:39
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
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import axios from "axios";
import { localSet } from "@/utils";
import Login from "@/components/Login.vue";

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

const showNetErr = (e) =>
  console.error(e) && ElMessage({ showClose: true, message: "请求出现错误", type: "error" });
const request = (method, url, succ, err, data = Object.create(null)) =>
  axios[method](url, data)
    .then(data => {
      const d = data.data
      console.log(d);
      if (d && d.code === 0) {
        succ(d);
      }
      else if(d && d.code !== 0){
        err(d);
        console.error(d);
        showMsg.err(d.msg);
        d.code === -2 && localSet('is_login', false);
        d.code === -2 && ElMessageBox({
          title: '请登录',
          message: Login
        });
      }
    })
    .catch((e) => {
      showNetErr(e); err(e);
    })
    .finally();

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
  group_list_all : BaseUri + "/midas/admin/all_group",
  group_list     : BaseUri + "/midas/admin/group",
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
  delete($url, $fb, $err = () => {}) {
    request("delete", $url, $fb, $err);
  },
};

const app = createApp(App); // 生成 Vue 实例 app

app.config.globalProperties.getUserRights = (fun = ()=>{}) => {
  req.get(urls.getUserSideMenu, data =>{
    let user_rights = [];
    console.log(data);
    data.rights.forEach((r) => {
      const { id, parent, type, path, name, icon } = r;
      if (r.parent !== 0) {
        if (!user_rights[r.parent] instanceof Object)
          user_rights[r.parent] = { ...data.rights[r.parent], children: [] };
        user_rights[r.parent].children.push({
          id,
          parent,
          type,
          path,
          name,
          icon,
          children: [],
        });
      } else
        user_rights[r.id] = { id, parent, type, path, icon, name, children: [] };
    });

    localSet("user_rights", user_rights);
    localSet("all_rights", data.rights);
    fun(user_rights);
  });
};

app.config.globalProperties.showMsg = showMsg;
app.config.globalProperties.urls    = urls;
app.config.globalProperties.req     = req;
app.config.globalProperties.goTop   = function () {
  const main = document.querySelector(".main");
  main.scrollTop = 0;
};

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
