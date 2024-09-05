<template>
  <div class="globalTable" ref="contentBoxRef">
    <div class="globalTable__header" ref="searchBoxRef">
      <global-search :searchData="searchData" :formOption="formOption" @search="getTableData"></global-search>
    </div>
    <div class="globalTable__box">
      <div class="globalTable__box--btn">
        <a-space>
          <a-button :icon="h(PlusSquareOutlined)" type="primary" @click="handleAdd('')">新增类目</a-button>
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
        <template #bodyCell="{ text, column }">
          <template v-if="column.dataIndex === 'type'">
            <a-tag :bordered="false" :color="columnType(text).color">{{ columnType(text).label }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <span>
              <a-button type="link" primary @click="handleAdd(text)">
                {{ text.type === 2 ? "新增章" : text.type === 3 ? "新增节" : "" }}
              </a-button>
              <a-divider type="vertical" v-if="text.type !== 4" />
              <a-button type="link" primary @click="handleEdit(text)">编辑</a-button>
              <a-divider type="vertical" />
              <a-button
                type="link"
                danger
                @click="
                  handleDelete(
                    text,
                    text.type === 2
                      ? '删除该【篇】类目，并同时删除其子类目'
                      : text.type === 3
                        ? '删除该【章】类目，并同时删除其子类目'
                        : ''
                  )
                "
                >删除</a-button
              >
            </span>
          </template>
        </template>
      </a-table>
      <add-catalog
        v-model:show="catalogVisible"
        :title="title"
        :modelType="modelType"
        :currentObj="currentObj"
        :parentId="parentId"
        @refresh="getTableData"
      ></add-catalog>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { DeleteOutlined, PlusSquareOutlined } from "@ant-design/icons-vue"
  import { h, ref } from "vue"
  import addCatalog from "./components/addCatalog.vue"
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
  import { delCourse, getCourseBookTree } from "@/api/courseware"
  import { textbookType } from "@/constants/dict"
  import { useTable } from "@/hooks/useTable"
  import { getNewData, tableColumns } from "@/utils/common"
  import { useRoute } from "vue-router"
  const columns = tableColumns([
    // {
    //   title: "排序",
    //   fixed: "left",
    //   dataIndex: "sort",
    //   width: 100
    //   // customRender: ({ index }) => {
    //   //   return index + 1
    //   // }
    // },
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
    useTable(contentBoxRef, searchBoxRef, getCourseBookTree, delCourse, searchData, {})
  const newTableData = computed(() => {
    return getNewData(tableData.value)
  })
  // #endregion

  // #region 弹框
  const title = ref<string>("")
  const catalogVisible = ref<boolean>(false)
  const currentObj = ref<any>({})
  const modelType = ref<number>(1)
  const parentId = ref<number>(0)
  const handleAdd = (v) => {
    currentObj.value = {}
    title.value = "新增"
    console.log(v)
    if (v) {
      modelType.value = v.type + 1
      parentId.value = v.id
    } else {
      modelType.value = 2
      parentId.value = Number(route.query.id)
    }

    catalogVisible.value = true
  }
  const handleEdit = (row: any) => {
    console.log(row)
    currentObj.value = row
    title.value = "编辑"
    modelType.value = row.type
    parentId.value = row.parentId
    catalogVisible.value = true
  }
  // #endregion

  onMounted(() => {
    getTableData()
  })
</script>

<style lang="less" scoped>
  .configEle {
    position: relative;
  }
</style>
