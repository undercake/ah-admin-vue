<template>
  <el-scrollbar>
    <el-aside class="aside">
      <div class="head">
        <div>
          <span>vue3 admin</span>
        </div>
      </div>
      <div class="line" />
      <el-menu
        background-color="#222832"
        text-color="#fff"
        :default-active="state.path"
      >
        <el-menu-item index="/index" @click="push_route('/index')"
          ><i class="fa fa-solid fa-house"></i>首页</el-menu-item
        >
        <el-sub-menu
          v-for="(title, index) in state.data"
          :key="title.id"
          :index="'-' + index"
        >
          <template #title>
            <span> <i :class="'fa ' + title.icon"></i> {{ title.name }}</span>
          </template>
          <el-menu-item-group v-if="title.children">
            <el-menu-item
              v-for="(item, i) in title.children"
              :key="item.id"
              :index="item.path"
              @click="push_route(item.path)"
              >{{ item.name }}</el-menu-item
            >
          </el-menu-item-group>
          <el-menu-item-group v-else>
            <el-menu-item :index="title.path" @click="push_route(title.path)"
              ><i :class="'fa ' + item.icon"></i> <i :class="title.icon"></i>
              {{ title.name }}</el-menu-item
            >
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="1">
          <template #title>
            <span>Dashboard</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/add" @click="push_route('/add')"
              >添加商品</el-menu-item
            >
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <span>首页配置</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/swiper" @click="push_route('/swiper')"
              >轮播图配置</el-menu-item
            >
            <el-menu-item index="/hot" @click="push_route('/hot')"
              >热销商品配置</el-menu-item
            >
            <el-menu-item index="/new" @click="push_route('/new')"
              >新品上线配置</el-menu-item
            >
            <el-menu-item index="/recommend" @click="push_route('/recommend')"
              >为你推荐配置</el-menu-item
            >
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <span>模块管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/category" @click="push_route('/category')"
              >分类管理</el-menu-item
            >
            <el-menu-item index="/good" @click="push_route('/good')"
              >商品管理</el-menu-item
            >
            <el-menu-item index="/guest" @click="push_route('/guest')"
              >会员管理</el-menu-item
            >
            <el-menu-item index="/order" @click="push_route('/order')"
              >订单管理</el-menu-item
            >
          </el-menu-item-group>
        </el-sub-menu>
        <el-sub-menu index="4">
          <template #title>
            <span>系统管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/account" @click="push_route('/account')"
              >修改密码</el-menu-item
            >
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
      <div class="bottom">
        <div @click="getRights">
          <span>刷新</span>
        </div>
      </div>
    </el-aside>
  </el-scrollbar>
</template>
<script setup>
import { onMounted, reactive, getCurrentInstance } from "vue";
import { localGet } from "@/utils";
import { useRouter } from "vue-router";

const { getUserRights, mittBus } =
  getCurrentInstance().appContext.config.globalProperties;
const { push, currentRoute } = useRouter();

const push_route = (e) => {
  state.path = e;
  mittBus.emit('routeChange', e);
  push(e);
};

const state = reactive({
  data: [],
  path: "/",
});

const process_data = (d) => {
  state.data = [];
  d.forEach((e) => {
    if (e) {
      const tmp_arr = { ...e };
      const children = [];
      if (e.children) {
        e.children.forEach((c) => {
          c.type === 0 && children.push({ ...c });
        });
        tmp_arr.children = Array.from(new Set(children));
      }
      state.data.push(tmp_arr);
    }
  });
};
const getRights =e=>{
  getUserRights(process_data);
}
onMounted(() => {
  let d = localGet("user_rights");
  d ? process_data(d) : getUserRights((e) => process_data(e));
  state.path = currentRoute._rawValue.path;
});

</script>
<style scoped>
.aside {
  width: 220px !important;
  background-color: #222832;
  min-height: 100%;
}
.head {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
}
.head > div {
  display: flex;
  align-items: center;
}

.head img {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}
.head span {
  font-size: 20px;
  color: #ffffff;
}
.line {
  border-top: 1px solid hsla(0, 0%, 100%, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
i.fa {
  margin: 0 10px 0 10px;
  font-size: 1.06rem;
  line-height: 56px;
}
</style>
<style>
.el-scrollbar .el-scrollbar__view {
  height: 100%;
}
.el-menu-item-group ul{
  box-shadow:  0 0 rgba(0, 0, 0, .3),
            0 0 0 rgba(14, 20, 25, .4),
            inset -3px -3px 5px rgba(14, 20, 25, .4),
            inset 3px 3px 5px rgba(0, 0, 0, .3);
}
</style>
