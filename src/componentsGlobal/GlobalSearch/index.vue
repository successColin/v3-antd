<template>
  <div class="globalSearch">
    <a-form ref="searchFormRef" layout="vertical" :model="searchData">
      <a-space>
        <a-form-item :name="v.name" :label="v.label" v-for="(v, i) in formOption" :key="i">
          <component
            v-model:value="searchData[v.name]"
            :style="`width: ${v.width || '200px'}`"
            :placeholder="v.placeholder"
            :is="v.component"
            :option="v.option"
          />
        </a-form-item>
        <a-space style="margin-top: 28px">
          <a-button type="primary" :icon="h(SearchOutlined)" @click="handleSearch">查询</a-button>
          <a-button :icon="h(SyncOutlined)" @click="resetSearch">重置</a-button>
        </a-space>
      </a-space>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { SearchOutlined, SyncOutlined } from "@ant-design/icons-vue"
  import { h, ref } from "vue"

  withDefaults(
    defineProps<{
      formOption: Array<any>
      searchData: any
    }>(),
    {
      formOption: () => [],
      searchData: {}
    }
  )

  const searchFormRef = ref()
  const emit = defineEmits(["search"])
  const handleSearch = () => {
    emit("search")
  }
  const resetSearch = () => {
    console.log(searchFormRef.value)
    searchFormRef.value?.resetFields()
    emit("search")
  }
</script>

<style lang="less" scoped>
  .globalSearch {
    // ::v-deep(.ant-form) {
    //   display: flex;
    //   flex-wrap: wrap;
    // }
    ::v-deep(.ant-space) {
      flex-wrap: wrap;
    }
    ::v-deep(.ant-form-item) {
      margin-bottom: 0;
    }
  }
</style>
