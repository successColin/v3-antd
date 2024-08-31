<template>
  <Layout.Header :style="headerStyle" class="layout-header">
    <div class="header-left">
      <slot name="left">
        <Space :size="20">
          <!-- <span class="menu-fold cursor-pointer" @click="() => emit('update:collapsed', !collapsed)">
            <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
          </span> -->
          <LayoutBreadcrumb />
        </Space>
      </slot>
    </div>
    <!-- <div class="header-menu">
      <slot name="menu" />
    </div> -->
  </Layout.Header>
</template>

<script lang="tsx" setup>
  import { useLayoutSettingStore } from "@/store/modules/layoutSetting"
  // import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons-vue"
  import { Layout, Space, type MenuTheme } from "ant-design-vue"
  import { computed, type CSSProperties } from "vue"
  import { LayoutBreadcrumb } from "./components/"

  defineProps({
    collapsed: {
      type: Boolean
    },
    theme: {
      type: String as PropType<MenuTheme>
    }
  })

  const emit = defineEmits(["update:collapsed"])
  const layoutSettingStore = useLayoutSettingStore()
  const headerStyle = computed<CSSProperties>(() => {
    const { navTheme, layout } = layoutSettingStore.layoutSetting
    const isDark = navTheme === "dark" && layout === "topmenu"
    return {
      backgroundColor: navTheme === "realDark" || isDark ? "" : "rgba(255, 255, 255, 0.85)",
      color: isDark ? "rgba(255, 255, 255, 0.85)" : "",
      height: "50px"
    }
  })
</script>

<style lang="less" scoped>
  .layout-header {
    display: flex;
    position: sticky;
    z-index: 10;
    top: 0;
    align-items: center;
    justify-content: space-between;
    height: var(--app-header-height);
    padding: 0 20px;

    .header-right {
      min-width: 180px;
      cursor: pointer;
    }

    .header-menu {
      flex: 1;
      align-items: center;
      min-width: 0;

      height: 50px;
      line-height: 50px;
      border-bottom: 0;
    }
    // ::v-deep .ant-menu-horizontal {
    //   border-bottom: none !important;
    // }
  }
  ::v-deep(.ant-layout-header) {
    
  }
</style>
