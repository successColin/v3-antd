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
      console.log(params)
      const res = await getApi(params)
      console.log(res)
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
    // paginationData.currentPage === 1 ? getTableData() : (paginationData.currentPage = 1)
  }
  const { uConfirm } = useBottom()
  const handleDelete = (row: any) => {
    delFun(row.id, "删除该条数据")
  }
  const handleBatchDel = () => {
    const ids = multipleSelection.value.join(",")
    if (!ids) {
      return message.warn('请选择数据')
    }
    delFun(ids, "批量删除数据")
  }
  const delFun = (id: string | number, dec: string) => {
    uConfirm(dec, async () => {
      await delApi({
        id,
        status: 2
      })
      message.success('删除成功')
      handleSearch()
    })
  }
  const multipleSelectionAllArr = ref<any>([])
  const handleSelectionChange = (val: Array<any>) => {
    nextTick(() => {
      if (!val.length) return
      multipleSelection.value = []
      multipleSelectionAllArr.value = val
      val.forEach((v) => {
        return multipleSelection.value.push(v.id)
      })
    })
  }
  const indexMethod = (index: number) => {
    return index + 1
  }
  return {
    allDate,
    height,
    indexMethod,
    multipleSelection,
    multipleSelectionAllArr,
    loading,
    tableData,
    getTableData,
    handleSearch,
    handleDelete,
    handleBatchDel,
    handleSelectionChange
  }
}
