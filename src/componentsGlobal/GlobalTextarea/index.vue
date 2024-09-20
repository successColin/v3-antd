<template>
  <a-textarea
    :value="value"
    :placeholder="placeholder"
    :style="style"
    :disabled="disabled"
    :rows="2"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      value: string | number
      placeholder?: string
      style?: Object
      disabled?: boolean
    }>(),
    {
      value: "",
      placeholder: "请输入",
      style: () => ({}),
      disabled: false
    }
  )

  const emit = defineEmits(["update:value"])
  const handleChange = (val: any) => {
    emit("update:value", val.target.value)
  }
</script>

<style lang="less" scoped></style>
