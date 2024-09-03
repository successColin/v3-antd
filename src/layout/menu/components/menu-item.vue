<template>
  <Menu.Item :key="item?.name" @click="handleMenuItemClick(item)">
    <MenuItemContent :item="item" />
  </Menu.Item>
</template>

<script setup lang="ts">
  import { Menu } from "ant-design-vue"
  import type { PropType } from "vue"
  import type { RouteRecordRaw } from "vue-router"
  import { useRoute, useRouter } from "vue-router"
  import MenuItemContent from "./menu-item-content.vue"

  defineOptions({
    name: "MyMenuItem"
  })

  defineProps({
    item: {
      type: Object as PropType<RouteRecordRaw>,
      default: () => ({})
    }
  })

  const router = useRouter()
  const route = useRoute()

  const handleMenuItemClick = (item: RouteRecordRaw) => {
    console.log("点击了1", item, route)
    const { isExt, extOpenMode } = item.meta || {}
    if (isExt && extOpenMode !== 2) {
      window.open(item.path)
    } else {
      router.push({ name: item.name })
    }
  }
</script>
