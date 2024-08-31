<template>
  <a-tabs :activeKey="activeKey" @change="handleChange">
    <a-tab-pane v-for="v in tabArrs" :key="v.key" :tab="v.tab">
      <slot></slot>
    </a-tab-pane>
    <template #rightExtra>
      <slot name="rightExtra"></slot>
    </template>
  </a-tabs>
</template>

<script setup lang="ts">
  type tabArrsType = {
    tab: string
    key: number
  }
  withDefaults(
    defineProps<{
      activeKey: number | string
      tabArrs: Array<tabArrsType>
    }>(),
    {}
  )
  const emit = defineEmits(["update:activeKey", "change"])
  const handleChange = (val: any) => {
    emit("update:activeKey", val)
    emit("change", val)
  }
</script>

<style lang="scss" scoped></style>
