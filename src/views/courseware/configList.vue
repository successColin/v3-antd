<template>
  <div class="globalTable" ref="contentBoxRef">
    <div class="globalTable__header" ref="searchBoxRef">
      <global-search :searchData="searchData" :formOption="formOption" @search="getTableData"></global-search>
    </div>
    <div class="globalTable__box">
      <div class="globalTable__box--btn">
        <a-space>
          <a-button :icon="h(DeleteOutlined)" type="primary" danger @click="handleBatchDel">批量删除</a-button>
        </a-space>
      </div>
      <a-table
        :columns="columns"
        :loading="loading"
        :data-source="newTableData"
        :row-selection="rowSelection"
        :pagination="false"
        rowKey="id"
        :scroll="{ y: height }"
        childrenColumnName="childNodes"
        @resizeColumn="handleResizeColumn"
      >
        <template #bodyCell="{ text, column, record }">
          <template v-if="column.dataIndex === 'coursewareList'">
            <a-button type="link" primary @click="handleView(record)">{{ text.length }}个课本</a-button>
          </template>
          <template v-if="column.dataIndex === 'type'">
            <a-tag :bordered="false" :color="columnType(text).color">{{ columnType(text).label }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <span>
              <a-button type="link" primary @click="handleEdit(text)">配置课件</a-button>
              <a-divider type="vertical" />
              <a-button type="link" danger @click="handleDelete(text, `删除${text.name}的课件`)">删除课件</a-button>
            </span>
          </template>
        </template>
      </a-table>
      <add-courseware
        v-model:show="catalogVisible"
        :currentObj="currentObj"
        :isView="isView"
        @refresh="getTableData"
      ></add-courseware>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { DeleteOutlined } from "@ant-design/icons-vue"
  import { h, ref } from "vue"
  import { useRoute } from "vue-router"
  import addCourseware from "./components/addCourseware.vue"
  const route = useRoute()

  // #region 搜索条件
  const searchData = ref<any>({
    courseBookId: route.query.id,
    name: "",
    createName: "",
    createNo: "",
    createTime: "",
    updateName: "",
    updateNo: "",
    updateTime: ""
  })
  const formOption = [
    {
      label: "学习目录",
      name: "name",
      placeholder: "请输入学习目录",
      component: "globalInput"
    },
    {
      label: "创建人名称",
      name: "createName",
      placeholder: "请输入创建人名称",
      component: "globalInput"
    },
    {
      label: "创建人工号",
      name: "createNo",
      placeholder: "请输入创建人工号",
      component: "globalInput"
    },
    {
      label: "创建时间",
      name: "createTime",
      placeholder: "请选择创建时间",
      component: "GlobalDatePicker"
    },
    {
      label: "更新人名称",
      name: "updateName",
      placeholder: "请输入更新人名称",
      component: "globalInput"
    },
    {
      label: "更新人工号",
      name: "updateNo",
      placeholder: "请输入更新人工号",
      component: "globalInput"
    },
    {
      label: "更新时间",
      name: "updateTime",
      placeholder: "请选择更新时间",
      component: "GlobalDatePicker"
    }
  ]
  // #endregion

  // #region 表格
  import { delCourseware, getCourseBookTree } from "@/api/courseware"
  import { textbookType } from "@/constants/dict"
  import { useTable } from "@/hooks/useTable"
  import { getNewData, tableColumns } from "@/utils/common"
  const columns = tableColumns([
    {
      title: "学习目录",
      dataIndex: "name",
      fixed: "left",
      width: 230
    },
    {
      title: "类目",
      dataIndex: "type",
      width: 100
    },
    {
      title: "课件详情",
      dataIndex: "coursewareList",
      width: 100
    },
    {
      title: "创建人",
      dataIndex: "createName",
      width: 180
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 180
    },
    {
      title: "更新人",
      dataIndex: "updateName",
      width: 180
    },
    {
      title: "更新时间",
      dataIndex: "updateTime",
      width: 180
    },
    {
      title: "操作",
      key: "action",
      width: 200,
      fixed: "right"
    }
  ])

  const columnType = computed(() => {
    return function (type: number) {
      return textbookType.filter((v) => type === +v.value)[0] || {}
    }
  })

  const contentBoxRef = ref<HTMLElement | null>()
  const searchBoxRef = ref<HTMLElement | null>()
  const { height, loading, tableData, rowSelection, getTableData, handleDelete, handleBatchDel, handleResizeColumn } =
    useTable(contentBoxRef, searchBoxRef, getCourseBookTree, delCourseware, searchData, {})
  const newTableData = computed(() => {
    return getNewData(tableData.value)
  })
  // #endregion

  // #region 弹框
  const currentObj = ref<any>({})
  const catalogVisible = ref<boolean>(false)
  const isView = ref<boolean>(false)
  const handleEdit = (row: any) => {
    currentObj.value = row
    isView.value = false
    catalogVisible.value = true
  }
  const handleView = (row: any) => {
    console.log(row)
    currentObj.value = row
    isView.value = true
    catalogVisible.value = true
  }
  // #endregion

  getTableData()
</script>

<style lang="less" scoped>
  .configEle {
    position: relative;
  }
</style>
