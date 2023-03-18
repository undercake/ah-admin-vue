<template>
  <div class="header">
    <div class="left">
      <i class="fa-solid fa-arrow-left" v-if="state.hasBack" @click="back"></i>
      <span style="font-size: 20px">{{ state.name }}</span>
      <el-dropdown class="bg-selector">
        <span class="el-dropdown-link">
          <span class="bg"></span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <span
                class="bg"
                v-for="(bg_, i) in bg_list"
                :key="i"
                :class="bg_"
                @click="change_bg(bg_)"
              ></span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="right">
      <el-dropdown>
        <span class="el-dropdown-link">
          <div class="author">
            <i class="fa-solid fa-user"></i>
            {{ state.userInfo.nickName || "" }}
          </div>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>{{
              (state.userInfo && state.userInfo.groupName) || ""
            }}</el-dropdown-item>
            <el-dropdown-item divided @click="logout"
              ><i class="fa-solid fa-right-from-bracket"></i
              >退出</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import { localGet } from "@/utils";

const changeBg = defineEmits();
const change_bg = (e) => changeBg("changebg", e);

const app = getCurrentInstance();
const { urls, req, getRouteName, mittBus, getUserRights } =
  app.appContext.config.globalProperties;
const router = useRouter();
const state = reactive({
  name: "dashboard",
  userInfo: { nickName: "", groupName: "" }, // 用户信息变量
  hasBack: false, // 是否展示返回icon
  path: "",
});

// 背景颜色
const bg_list = ["bg-white", "bg-green", "bg-orange", "bg-red", "bg-blue"];

// 初始化执行方法
onMounted(() => {
  state.path = router.currentRoute._rawValue.path;
  // const pathName = localGet("user.rights");
  // const path = [];
  mittBus.on("routeChange", (e) => {
    state.name = getRouteName(e);
    console.log(e);
  });
  getUserRights(()=>state.name = getRouteName(state.path));
  console.log(state.path);
  // pathName &&
  //   pathName.forEach((e) => {
  //     if (e && e.path && e.path == state.path) path.push(e.name);
  //   });
  // path[0] && path[0].name && (state.name = path[0].name);
  getUserInfo();
});
// 获取用户信息
const getUserInfo = async () => {
  state.userInfo.nickName = localGet("user_nickname");
  state.userInfo.groupName = localGet("user_group");
  // state.userInfo = userInfo
};
// 退出登录
const logout = () => {
  req.get(urls.logout);
  router.push("/login");
};
</script>

<style scoped>
.bg-green .header,
.bg-orange .header,
.bg-red .header,
.bg-blue .header {
  background: rgba(255, 255, 255, 0.7);
}
.header {
  height: 50px;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}
.header .left .back {
  border: 1px solid #e9e9e9;
  padding: 5px;
  border-radius: 50%;
  margin-right: 5px;
  cursor: pointer;
}
.bg-selector {
  margin-left: 3rem;
}
span.bg {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin: 0 2px 0;
  border: #a0cfff solid 2px;
  border-radius: 0.1rem;
}
span.bg:hover {
  border-color: #409eff;
}

.right {
  margin-right: 5rem;
}
.right > div > .icon {
  font-size: 18px;
  margin-right: 6px;
}
.author {
  margin-left: 10px;
  cursor: pointer;
  font-size: 1.3rem;
}
</style>

<style>
.popper-user-box {
  background: url("https://s.yezgea02.com/lingling-h5/static/account-banner-bg.png")
    50% 50% no-repeat !important;
  background-size: cover !important;
  border-radius: 0 !important;
}
.popper-user-box .nickname {
  position: relative;
  color: #ffffff;
}
.popper-user-box .nickname .logout {
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}
</style>
