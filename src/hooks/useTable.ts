// interface paginationData {
//   currentPage: number
//   pageSize: number
//   total: number
// }
import { useBottom } from "@/hooks/useModalDel"
import { watchEle } from "@/hooks/userContentHeight"
import { message } from 'ant-design-vue'
/** 主题 hook */
export function useTable(
  contentBoxRef: any,
  searchBoxRef: any,
  getApi: Function,
  delApi: Function,
  searchData: any,
  paginationData: any,
) {
  const loading = ref<boolean>(false)
  const tableData = ref([])
  const multipleSelection = ref<number[]>([])
  const allDate = ref<any>([])
  let height = ref<number>(0)
  if (contentBoxRef && searchBoxRef) {
    const { height: boxH } = watchEle(contentBoxRef, true)
    const { height: searchH } = watchEle(searchBoxRef, false)
    watch(
      [boxH, searchH],
      (v: any) => {
        height.value = v[0] - v[1]
      },
      { deep: true, immediate: true }
    )
  }

  const getTableData = async () => {
    loading.value = true
    try {
      const params = {
        ...searchData.value
      } as any
      if (Object.keys(paginationData).length) {
        params.page = paginationData.currentPage
        params.page_size = paginationData.pageSize
      }
      const res = await getApi(params)
      if (Object.keys(paginationData).length) {
        allDate.value = res
        const { data, total } = res
        paginationData.total = total
        tableData.value = data
      } else {
        tableData.value = res
      }
      loading.value = false
    } catch (error) {
      tableData.value = []
      loading.value = false
    }
  }
  const handleSearch = () => {
    if (paginationData.currentPage) {
      paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
    } else {
      getTableData()
    }
  }
  const { uConfirm } = useBottom()
  const handleDelete = (row: any, dec?: string) => {
    delFun([row.id], dec || "删除该条数据")
  }
  const handleBatchDel = () => {
    if (!multipleSelection.value.length) {
      return message.warn('请选择数据')
    }
    delFun(multipleSelection.value, "批量删除数据")
  }
  const delFun = (ids: Array<any>, dec: string) => {
    uConfirm(dec, async () => {
      await delApi(ids)
      message.success('删除成功')
      multipleSelection.value = []
      handleSearch()
    })
  }
  const multipleSelectionAllArr = ref<any>([])

  const rowSelection = ref({
    checkStrictly: true,
    fixed: true,
    columnWidth: 50,
    selectedRowKeys: multipleSelection,
    onChange: (selectedRowKeys, selectedRows) => {
      multipleSelection.value = selectedRowKeys
      multipleSelectionAllArr.value = selectedRows
    },
    // onSelect: (record, selected: boolean, selectedRows) => {
    // },
    // onSelectAll: (selected: boolean, selectedRows) => {
    //   // multipleSelection.value = selectedRows.map((v) => {
    //   //   if (v.id) {
    //   //     return v.id
    //   //   }
    //   // })
    //   // multipleSelectionAllArr.value = selectedRows
    // }
  })

  function handleResizeColumn(w, col) {
    col.width = w;
  }
  return {
    rowSelection,
    allDate,
    height,
    multipleSelection,
    multipleSelectionAllArr,
    loading,
    tableData,
    getTableData,
    handleSearch,
    handleDelete,
    handleBatchDel,
    handleResizeColumn
  }
}
