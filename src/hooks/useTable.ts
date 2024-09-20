// interface paginationData {
//   pageNum: number
//   pageSize: number
//   total: number
// }
import { useBottom } from "@/hooks/useModalDel";
import { watchEle } from "@/hooks/userContentHeight";
import { execDecrypt } from "@/utils/aes";
import { message } from 'ant-design-vue';
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
  const tableData = ref<any>([])
  const multipleSelection = ref<number[]>([])
  let height = ref<number>(0)
  if (contentBoxRef && searchBoxRef) {
    const { height: boxH } = watchEle(contentBoxRef, true)
    const { height: searchH } = watchEle(searchBoxRef, false)
    watch(
      [boxH, searchH],
      (v: any) => {
        if (Object.keys(paginationData).length) {
          height.value = v[0] - v[1] - 52
        } else {
          height.value = v[0] - v[1]
        }
      },
      { deep: true, immediate: true }
    )
  }
  const getTableData = async () => {
    loading.value = true
    try {
      let params = {} as any
      if (Object.keys(paginationData).length) {
        params.pageNum = paginationData.pageNum
        params.pageSize = paginationData.pageSize
        params.paramData = {
          ...searchData.value
        }
      } else {
        params = {
          ...searchData.value
        } as any
      }
      const res = await getApi(params)
      console.log(res)
      if (Object.keys(paginationData).length) {
        const { resultData, pagination } = res
        paginationData.total = pagination.totalCount
        console.log(11111)
        tableData.value = []
        resultData.forEach((v: any) => {
          const createName = execDecrypt(v.createName);
          const updateName = execDecrypt(v.updateName);
          const obj = {
            ...v,
            createName,
            updateName
          }
          tableData.value.push(obj)
        })
      } else {
        tableData.value = res
      }
      loading.value = false

      console.log(tableData)
    } catch (error) {
      tableData.value = []
      loading.value = false
    }
  }
  const handleSearch = () => {
    if (paginationData.pageNum) {
      paginationData.pageNum === 1 ? getTableData() : (paginationData.pageNum = 1)
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
  })

  function handleResizeColumn(w, col) {
    col.width = w;
  }
  return {
    rowSelection,
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
