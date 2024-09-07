<template>
  <div class="fixed__header">
    <router-link to="/">
      <img src="~@/assets/images/logo.png" alt="" />
    </router-link>
    <div class="fixed__header--right">
      <a-space :size="20">
        <a-dropdown placement="bottomRight">
          <a-avatar style="cursor: pointer" :src="userInfo.avatar" :alt="userInfo.nickName">{{
            userInfo?.nickName
          }}</a-avatar>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="router.push({ name: 'account-settings' })"> 个人设置 </a-menu-item>
              <a-menu-divider />
              <a-menu-item>
                <div @click.prevent="doLogout">
                  <PoweroffOutlined />
                  退出系统
                </div>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </div>
  </div>
  <a-layout class="layout">
    <a-layout-sider
      v-if="layoutSetting.layout === 'sidemenu'"
      v-model:collapsed="collapsed"
      :width="asiderWidth"
      :trigger="null"
      collapsible
      :theme="getTheme"
      class="layout-sider"
    >
      <AsideMenu :collapsed="collapsed" :theme="getTheme" />
    </a-layout-sider>
    <a-layout>
      <PageHeader v-model:collapsed="collapsed" :theme="getTheme">
        <template v-if="layoutSetting.layout === 'topmenu'" #menu>
          <AsideMenu :collapsed="collapsed" :theme="getTheme" />
        </template>
      </PageHeader>
      <a-layout-content class="layout-content">
        <tabs-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  import { useLayoutSettingStore } from "@/store/modules/layoutSetting"
  import { useUserStore } from "@/store/modules/user"
  import { PoweroffOutlined, QuestionCircleOutlined } from "@ant-design/icons-vue"
  import { Modal, message } from "ant-design-vue"
  import { storeToRefs } from "pinia"
  import { createVNode } from "vue"
  import PageHeader from "./header/index.vue"
  import AsideMenu from "./menu/menu.vue"
  import { TabsView } from "./tabs"

  const layoutSettingStore = useLayoutSettingStore()
  const { layoutSetting } = storeToRefs(layoutSettingStore)
  const collapsed = ref<boolean>(false)
  // 自定义侧边栏菜单收缩和展开时的宽度
  const asiderWidth = computed(() => (collapsed.value ? 80 : 220))
  const getTheme = computed(() => (layoutSetting.value.navTheme === "light" ? "light" : "dark"))

  const userStore = useUserStore()
  const userInfo = computed(() => userStore.userInfo) as any

  import { useRoute, useRouter } from "vue-router"
  const router = useRouter()
  const route = useRoute()

  // 退出登录
  import { LOGIN_NAME } from "@/router/constant"
  import { useKeepAliveStore } from "@/store/modules/keepAlive"
  const keepAliveStore = useKeepAliveStore()
  const doLogout = () => {
    Modal.confirm({
      title: "您确定要退出登录吗？",
      icon: createVNode(QuestionCircleOutlined),
      centered: true,
      onOk: async () => {
        await userStore.logout()
        keepAliveStore.clear()
        // 移除标签页
        localStorage.clear()
        message.success("成功退出登录")
        router.replace({
          name: LOGIN_NAME,
          query: {
            redirect: route.fullPath
          }
        })
      }
    })
  }
</script>

<style lang="less" scoped>
  .layout {
    display: flex;
    height: calc(100vh - 60px);
    overflow: hidden;
    .ant-layout {
      overflow: hidden;
      background: #fbfbfb !important;
    }
    .layout-content {
      flex: none;
    }
  }
  .fixed__header {
    height: 60px;
    background: linear-gradient(to right, rgba(17, 75, 94, 0.8) 30%, rgb(17, 75, 94) 100%);
    // background: rgb(17, 75, 94);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px 0 20px;
    img {
      height: 30px;
    }
  }

  ::v-deep(.ant-layout .ant-layout-header) {
    height: 50px !important;
    background-color: rgb(251, 251, 251) !important;
  }
</style>
