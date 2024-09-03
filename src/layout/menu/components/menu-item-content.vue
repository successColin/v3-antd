<template>
  <template v-if="item?.meta?.icon">
    <Icon :icon="item.meta.icon" type="svg" />
  </template>
  <span v-if="!collapsed">{{ item?.meta?.title }}</span>
</template>

<script lang="ts" setup>
  import { Icon } from '@/components/basic/icon'
  import type { RouteRecordRaw } from 'vue-router'

  defineOptions({
    name: 'MenuItemContent'
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
</script>
