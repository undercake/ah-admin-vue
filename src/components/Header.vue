<template>
  <div class="header">
    <div class="left">
      <i class="fa-solid fa-arrow-left" v-if="state.hasBack" @click="back"></i>
      <span style="font-size: 20px">{{ state.name }}</span>
      <el-dropdown class="bg-selector right">
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
            <el-dropdown-item disabled>
              管理员角色：{{ (state.userInfo && state.userInfo.groupName) || "" }}
            </el-dropdown-item>
            <el-dropdown-item @click="()=>router.push('/my_pass')">
              修改密码
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              <i class="fa-solid fa-right-from-bracket" />
              退出
            </el-dropdown-item>
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
  name: "加载中...",
  userInfo: { nickName: "", groupName: "" }, // 用户信息变量
  hasBack: false, // 是否展示返回icon
  path: "",
});

// 背景颜色
const bg_list = [
  "bg-white",
  "bg-green",
  "bg-orange",
  "bg-red",
  "bg-blue",
  "bg-dark",
];

// 初始化执行方法
onMounted(() => {
  state.path = router.currentRoute._rawValue.path;
  mittBus.on("routeChange", (e) => {
    if (e === false) return (state.name = "加载中...");
    state.name = getRouteName(e);
    console.log(e);
  });
  getUserRights(() => (state.name = getRouteName(state.path)));
  console.log(state.path);
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
.bg-white.bg,
.bg-white .bg {
  background-color: #fff;
}
.bg-dark .bg,
.bg-dark.bg {
  background-color: #212121;
}
.bg-green .bg {
  background-color: #e1f3d8;
}
.bg-orange .bg {
  background-color: #faecd8;
}
.bg-red .bg {
  background-color: #fde2e2;
}
.bg-blue .bg {
  background-color: #d9ecff;
}
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
.header > .left {
  min-width: 300px;
}
.header > .left > .right {
  margin-right: 0;
  float: right;
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
  width: 1.4rem;
  height: 1.4rem;
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
