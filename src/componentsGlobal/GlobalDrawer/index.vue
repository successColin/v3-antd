<template>
  <a-drawer
    ref="drawerRef"
    :title="title"
    :placement="direction"
    :open="show"
    :width="width"
    :footer-style="{ textAlign: 'right' }"
    @close="handleClose"
  >
    <slot></slot>
    <template #footer>
      <a-button style="margin-right: 8px" @click="handleCancel">取消</a-button>
      <a-button v-if="isOk" type="primary" @click="emit('ok')" :loading="loading">确定</a-button>
    </template>
  </a-drawer>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      title?: string
      show: boolean
      width?: string
      direction?: any
      loading?: boolean
      isOk?: boolean
    }>(),
    {
      title: "新增",
      show: false,
      width: "60%",
      direction: "right",
      loading: false,
      isOk: true
    }
  )

  const emit = defineEmits(["update:show", "closed", "ok"])

  const handleClose = () => {
    emit("update:show", false)
    emit("closed")
  }
  const handleCancel = () => {
    emit("update:show", false)
  }
</script>
<style lang="less" scoped></style>
