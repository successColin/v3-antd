<template>
  <a-select ref="select" :placeholder="placeholder" :value="value" :style="style" @change="handleChange">
    <a-select-option v-for="(v, i) in option" :value="v.value" :key="i">{{ v.label }}</a-select-option>
  </a-select>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      value: string | number | null
      placeholder?: string
      style?: Object
      option: Array<any>
    }>(),
    {
      value: "",
      placeholder: "请输入",
      style: () => ({}),
      option: () => []
    }
  )

  const emit = defineEmits(["update:value", "change"])
  const handleChange = (val: any) => {
    emit("update:value", val)
    emit("change", val)
  }
</script>

<style lang="less" scoped></style>
