<template>
  <a-checkbox-group
    :value="value"
    name="checkboxgroup"
    :style="style"
    :disabled="disabled"
    :options="options"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      value: Array<any>
      options: Array<{ value: string | number; label: string }>
      style?: any
      disabled?: boolean
    }>(),
    {
      value: () => [],
      options: () => [],
      style: {},
      disabled: false
    }
  )
  const emit = defineEmits(["update:value", "change"])
  const handleChange = (val: any) => {
    emit("update:value", val)
    emit("change", val)
  }
</script>

<style lang="less" scoped></style>
