<template>
  <div class="globalTable" ref="contentBoxRef">
    <div class="globalTable__header" ref="searchBoxRef">
      <a-space>
        <a-button danger>删除</a-button>
        <a-button type="primary">新建篇</a-button>
        <a-input-search
          v-model:value="searchData.name"
          placeholder="关键字搜索"
          style="width: 200px"
          @search="handleSearch"
        />
      </a-space>
    </div>
    <a-table
      :columns="columns"
      :data-source="tableData"
      :row-selection="rowSelection"
      :pagination="false"
      rowKey="id"
      :scroll="{ y: height }"
    >
      <template #bodyCell="{ text, column }">
        <template v-if="column.dataIndex === 'type'">
          <a-tag :bordered="false" :color="columnType(text).color">{{ columnType(text).label }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <span>
            <a-button type="link" primary>添加子类</a-button>
            <a-divider type="vertical" />
            <a-button type="link" primary>编辑</a-button>
          </span>
        </template>
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
  import { textbookType } from "@/constants/dict"
  import { tableColumns } from "@/utils/common"
  const columns = tableColumns([
    {
      title: "排序",
      fixed: "left",
      width: 60,
      customRender: ({ text, record, index }) => {
        return `${index + 1}`
      }
    },
    {
      title: "学习目录",
      dataIndex: "name",
      fixed: "left"
    },
    {
      title: "类目",
      dataIndex: "type",
      width: 100
    },
    {
      title: "创建人",
      dataIndex: "createByName"
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      width: 180
    },
    {
      title: "更新人",
      dataIndex: "updateByName"
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

  // const data: DataItem[] = [
  //   {
  //     key: 1,
  //     name: "John Brown sr.",
  //     age: 60,
  //     address: "New York No. 1 Lake Park",
  //     children: [
  //       {
  //         key: 11,
  //         name: "John Brown",
  //         age: 42,
  //         address: "New York No. 2 Lake Park"
  //       },
  //       {
  //         key: 12,
  //         name: "John Brown jr.",
  //         age: 30,
  //         address: "New York No. 3 Lake Park",
  //         children: [
  //           {
  //             key: 121,
  //             name: "Jimmy Brown",
  //             age: 16,
  //             address: "New York No. 3 Lake Park"
  //           }
  //         ]
  //       },
  //       {
  //         key: 13,
  //         name: "Jim Green sr.",
  //         age: 72,
  //         address: "London No. 1 Lake Park",
  //         children: [
  //           {
  //             key: 131,
  //             name: "Jim Green",
  //             age: 42,
  //             address: "London No. 2 Lake Park",
  //             children: [
  //               {
  //                 key: 1311,
  //                 name: "Jim Green jr.",
  //                 age: 25,
  //                 address: "London No. 3 Lake Park"
  //               },
  //               {
  //                 key: 1312,
  //                 name: "Jimmy Green sr.",
  //                 age: 18,
  //                 address: "London No. 4 Lake Park"
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     key: 2,
  //     name: "Joe Black",
  //     age: 32,
  //     address: "Sidney No. 1 Lake Park"
  //   }
  // ]

  const rowSelection = ref({
    checkStrictly: false,
    fixed: true,
    columnWidth: 50,
    onSelect: (record, selected: boolean, selectedRows) => {
      console.log(record, selected, selectedRows)
    },
    onSelectAll: (selected: boolean, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows)
    }
  })

  import { getCourseList } from "@/api/courseware"
  import { useTable } from "@/hooks/useTable"
  import { useRoute } from "vue-router"
  const route = useRoute()
  const searchData = ref({
    name: route.query.id
  })
  const contentBoxRef = ref<HTMLElement | null>()
  const searchBoxRef = ref<HTMLElement | null>()
  const {
    height,
    loading,
    tableData,
    getTableData,
    handleSearch,
    handleSelectionChange
    // work
  } = useTable(contentBoxRef, searchBoxRef, getCourseList, getCourseList, searchData, {})

  console.log(height, loading, tableData, getTableData, handleSearch, handleSelectionChange)
  onMounted(() => {
    getTableData()
  })
</script>

<style lang="less" scoped>
  .configEle {
    position: relative;
  }
</style>
