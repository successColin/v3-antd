<template>
  <a-radio-group :value="value" name="radioGroup" @change="handleChange" :disabled="disabled">
    <a-radio :value="v.value" v-for="(v, i) in options" :key="i">{{ v.label }}</a-radio>
  </a-radio-group>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      value: string | number
      options: Array<{ value: string | number; label: string }>
      style?: any
      disabled?: boolean
    }>(),
    {
      value: "",
      options: () => [],
      style: {},
      disabled: false
    }
  )
  const emit = defineEmits(["update:value", "change"])
  const handleChange = (val: any) => {
    emit("update:value", val.target.value)
    emit("change", val.target.value)
  }
</script>

<style lang="scss" scoped></style>
