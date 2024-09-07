export function watchEle(ele: Ref<HTMLDivElement | null>, state: boolean) {
  const height = ref(0)
  // 计算表格高度
  const calculateTableHeight = () => {
    if (ele.value) {
      if (state) {
        const tableH = (document.querySelector(".ant-table-header")?.clientHeight as any) || 0
        const tableBtn = (document.querySelector(".globalTable__box--btn")?.clientHeight as any) || 0
        height.value = ele.value.clientHeight - tableH - tableBtn
      } else {
        height.value = ele.value.clientHeight
      }
    }
  }
  onMounted(() => {
    nextTick(() => {
      setTimeout(() => {
        calculateTableHeight()
      }, 100)
    })
    window.addEventListener("resize", calculateTableHeight)
  })
  onBeforeUnmount(() => {
    window.removeEventListener("resize", calculateTableHeight)
  })
  return { height }
}
