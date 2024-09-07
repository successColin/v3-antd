<template>
  <div class="flex-cc" style="width: 100%">
    <a-empty>
      <template #image>
        <img class="nodata__img" src="~@/assets/images/nodata.png" alt="" />
      </template>
      <template #description>
        <span style="color: #999999; font-size: 14px"> {{ desc }} </span>
      </template>
      <slot name="btn"></slot>
    </a-empty>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      desc?: string
      mb?: number
      mt?: string
    }>(),
    {
      desc: "暂无数据",
      mb: 40,
      mt: "0"
    }
  )
</script>

<style lang="less" scoped>
  .nodata__img {
    height: 40vh;
  }

  ::v-deep(.ant-empty .ant-empty-image) {
    height: 240px;
  }
</style>
