<template>
  <global-tabs :tabArrs="tabArrs" v-model:activeKey="activeKey" class="theoryConfig">
    <template #rightExtra>
      <a-button type="primary" @click="handleConsolidateConfig">错题巩固设置</a-button>
    </template>
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
        <global-table
          :columns="columns"
          :loading="loading"
          :data="newTableData"
          :rowSelection="rowSelection"
          :height="height"
          :resizeColumn="handleResizeColumn"
          v-model:paginationData="paginationData"
        >
          <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'type'">
              <a-tag :bordered="false" :color="columnType(text).color">{{ columnType(text).label }}</a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <span>
                <a-button type="link" primary>编辑</a-button>
                <a-divider type="vertical" />
                <a-button type="link" danger @click="handleDelete(text, `删除${text.name}的课件`)">删除</a-button>
                <a-divider type="vertical" />
                <a-button type="link" primary @click="handleDelete(text, `删除${text.name}的课件`)">导出</a-button>
              </span>
            </template>
          </template>
        </global-table>

        <err-config-modal
          v-model:show="errConfigVisible"
          :currentObj="currentObj"
          @refresh="getTableData"
        ></err-config-modal>
      </div>
    </div>
  </global-tabs>
</template>
<script lang="ts" setup>
  import { DeleteOutlined } from "@ant-design/icons-vue"
  import { h, ref } from "vue"
  import errConfigModal from "./components/errConfigModal.vue"

  const tabArrs = [
    {
      label: "非解答题",
      value: 1
    }
  ]
  const activeKey = ref<number>(1)

  // #region 搜索条件
  import { topicType } from "@/constants/dict"
  const searchData = ref<any>({
    type: null,
    createName: "",
    createNo: "",
    createTime: "",
    updateName: "",
    updateNo: "",
    updateTime: ""
  })
  const formOption = [
    {
      label: "题目类型",
      name: "type",
      placeholder: "请选择题目类型",
      component: "GlobalSelect",
      option: topicType
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
  import { delCourseware, getExerciseConfig, getExerciseList } from "@/api/courseware"
  import { useTable } from "@/hooks/useTable"
  import { getNewData, tableColumns } from "@/utils/common"
  const columns = tableColumns([
    {
      title: "编号",
      dataIndex: "exerciseNum",
      fixed: "left",
      width: 100
    },
    {
      title: "题目内容",
      dataIndex: "content",
      fixed: "left",
      width: 230
    },
    {
      title: "题目类型",
      dataIndex: "type",
      fixed: "left",
      width: 100
    },
    {
      title: "归属篇",
      dataIndex: "partName",
      width: 180
    },
    {
      title: "归属章",
      dataIndex: "chapterName",
      width: 180
    },

    {
      title: "归属节",
      dataIndex: "sectionName",
      width: 180
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
      return topicType.filter((v) => type === +v.value)[0] || {}
    }
  })

  const paginationData = reactive({
    pageNum: 1,
    pageSize: 10,
    total: 0
  })
  const contentBoxRef = ref<HTMLElement | null>()
  const searchBoxRef = ref<HTMLElement | null>()
  const { height, loading, tableData, rowSelection, getTableData, handleDelete, handleBatchDel, handleResizeColumn } =
    useTable(contentBoxRef, searchBoxRef, getExerciseList, delCourseware, searchData, paginationData)
  const newTableData = computed(() => {
    return getNewData(tableData.value)
  })

  console.log(handleDelete)
  // #endregion

  // #region 弹框
  const currentObj = ref<any>({})
  const errConfigVisible = ref<boolean>(false)

  const handleConsolidateConfig = async () => {
    const res = await getExerciseConfig()
    console.log(res)
    
    errConfigVisible.value = true
  }
  // const handleEdit = (row: any) => {
  //   currentObj.value = row
  //   catalogVisible.value = true
  // }
  // const handleView = (row: any) => {
  //   currentObj.value = row
  //   catalogVisible.value = true
  // }
  // #endregion

  // 监听
  watch([() => paginationData.pageNum, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<style lang="less" scoped>
  .theoryConfig {
    height: 100%;
  }
</style>
