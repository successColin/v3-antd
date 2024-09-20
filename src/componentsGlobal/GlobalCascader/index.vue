<template>
  <a-cascader
    :value="value"
    :placeholder="placeholder"
    :options="option"
    :style="style"
    :fieldNames="fieldNames"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      value: Array<any>
      placeholder?: string
      style?: Object
      option: Array<any>
      fieldNames?: any
    }>(),
    {
      value: () => [],
      placeholder: "请输入",
      style: () => ({}),
      option: () => [],
      fieldNames: () => ({ label: "label", value: "value", children: "children" })
    }
  )
  const emit = defineEmits(["update:value"])
  const handleChange = (val: any) => {
    console.log(val)
    emit("update:value", val)
  }
</script>

<style lang="less" scoped></style>
