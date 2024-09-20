<template>
  <div class="globalTable">
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="data"
      :row-selection="rowSelection"
      :pagination="false"
      rowKey="id"
      :scroll="{ y: height }"
      @resizeColumn="resizeColumn"
    >
      <template #bodyCell="{ column, text }">
        <slot name="bodyCell" :column="column" :text="text"></slot>
      </template>
    </a-table>
    <a-pagination
      style="float: right; margin-top: 10px"
      :current="paginationData.pageNum"
      :pageSize="paginationData.pageSize"
      :total="paginationData.total"
      show-quick-jumper
      @change="handleChangePage"
    />
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      loading: boolean
      columns: Array<any>
      data: Array<any>
      rowSelection: any
      height: number
      resizeColumn: Function
      paginationData: any
    }>(),
    {
      loading: true,
      columns: () => [],
      data: () => [],
      rowSelection: () => {},
      height: 400,
      resizeColumn: () => {},
      paginationData: () => {}
    }
  )

  const emit = defineEmits(["update:paginationData"])
  const handleChangePage = (page, pageSize) => {
    props.paginationData.pageNum = page
    props.paginationData.pageSize = pageSize
  }
</script>

<style lang="less" scoped></style>
