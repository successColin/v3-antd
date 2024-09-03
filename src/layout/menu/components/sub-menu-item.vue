<template>
  <!-- 目录 -->
  <Menu.SubMenu v-if="isShowSubMenu(item)" :key="item?.name" v-bind="$attrs" @titleClick="handleClickTitle(item)">
    <template #title>
      <MenuItemContent :collapsed="collapsed" :item="item" />
    </template>
    <template v-for="child in item.children || []" :key="child.name">
      <MySubMenuItem :item="child" />
    </template>
  </Menu.SubMenu>
  <!-- 菜单 -->
  <MyMenuItem v-else :item="item" />
</template>

<script setup lang="ts">
  import { Menu } from "ant-design-vue"
  import type { PropType } from "vue"
  import type { RouteRecordRaw } from "vue-router"
  import { useRouter } from "vue-router"
  import MenuItemContent from "./menu-item-content.vue"
  import MyMenuItem from "./menu-item.vue"

  defineOptions({
    name: "MySubMenuItem"
  })

  defineProps({
    item: {
      type: Object as PropType<RouteRecordRaw>,
      default: () => ({})
    },
    collapsed: {
      type: Boolean
    }
  })

  const isShowSubMenu = (menuItem: RouteRecordRaw) => {
    return (
      menuItem?.meta?.type === 0 || (!Object.is(menuItem?.meta?.hideChildrenInMenu, true) && menuItem?.children?.length)
    )
  }

  const router = useRouter()
  const handleClickTitle = (item) => {
    console.log("点击了", item)
    const { isExt, extOpenMode } = item.meta || {}
    if (isExt && extOpenMode !== 2) {
      window.open(item.path)
    } else {
      router.push({ name: item.name })
    }
  }
</script>

<style scoped></style>
