<template>
  <a-date-picker
    v-bind="$attrs"
    :value="newValue"
    :format="dateFormat"
    :placeholder="placeholder"
    allowClear
    :disabled="disabled"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
  import dayjs, { Dayjs } from "dayjs"
  import "dayjs/locale/zh-cn"

  console.log(dayjs("2015-01-01", "YYYY-MM-DD"))

  const props = withDefaults(
    defineProps<{
      value: string
      placeholder?: string
      disabled?: boolean
      dateFormat?: string
    }>(),
    {
      value: "",
      placeholder: "请输入",
      disabled: false,
      dateFormat: "YYYY-MM-DD"
    }
  )

  import { computed } from "vue"
  const newValue = computed(() => {
    return props.value ? dayjs(props.value) : ''
  })

  const emit = defineEmits(["update:value"])

  const handleChange = (value: Dayjs, dateString: string) => {
    emit("update:value", dateString)
  }
</script>

<style lang="less" scoped></style>
