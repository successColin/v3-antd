<template>
  <a-modal
    :open="show"
    :title="title"
    @cancel="handleCancel"
    centered
    style="margin-bottom: 40px"
    :afterClose="handleAfterClose"
  >
    <slot></slot>
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" v-if="isOk" :loading="loading" @click="emit('ok')">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      show: boolean
      title?: string
      loading?: boolean
      isOk?: boolean
      width?: string
    }>(),
    {
      show: false,
      title: "新增",
      loading: false,
      isOk: true,
      width: "30%"
    }
  )
  const emit = defineEmits(["update:show", "closed", "ok"])
  const handleCancel = () => {
    emit("update:show", false)
  }

  const handleAfterClose = () => {
    emit("closed")
  }
</script>

<style lang="less" scoped></style>
