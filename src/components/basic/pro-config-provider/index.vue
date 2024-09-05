<script setup lang="ts">
  import { useLayoutSettingStore } from "@/store/modules/layoutSetting"
  import { ConfigProvider } from "ant-design-vue"
  import { configProviderProps } from "ant-design-vue/es/config-provider/context"
  import zhCN from "ant-design-vue/es/locale/zh_CN"
  import { merge } from "lodash-es"
  import { computed } from "vue"
  defineOptions({
    name: "ProConfigProvider"
  })

  const props = defineProps(configProviderProps())

  const layoutSetting = useLayoutSettingStore()

  const theme = computed(() => {
    return merge({}, layoutSetting.themeConfig, props.theme)
  })
</script>

<template>
  <ConfigProvider v-bind="$props" :theme="theme" :locale="zhCN">
    <slot />
  </ConfigProvider>
</template>
