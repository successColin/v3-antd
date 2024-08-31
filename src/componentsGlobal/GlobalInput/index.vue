<template>
  <a-input
    :value="value"
    :placeholder="placeholder"
    :style="style"
    allowClear
    :type="type"
    :disabled="disabled"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      value: string
      placeholder?: string
      style?: Object
      type?: string
      disabled?: boolean
    }>(),
    {
      value: "",
      placeholder: "请输入",
      style: () => ({}),
      type: "text",
      disabled: false
    }
  )

  const emit = defineEmits(["update:value"])
  const handleChange = (val: any) => {
    emit("update:value", val.target.value)
  }
</script>

<style lang="scss" scoped></style>
