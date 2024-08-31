<template>
  <global-tabs :tabArrs="tabArrs" v-model:activeKey="activeKey" class="courseware" @change="getListBooks">
    <template #rightExtra>
      <a-button type="primary" @click="handleAdd">添加课本</a-button>
    </template>
    <div class="flex courseware__box">
      <item-list
        v-if="catalogueList.length"
        :list="catalogueList"
        :itemStyle="itemStyle"
        @edit="handleEdit"
        @del="handleDel"
      ></item-list>
      <global-nodate v-else desc="温馨提示:当前还没有理论课本哦，请先添加新课本" mt="13vh"></global-nodate>
    </div>
    <add-modalele
      v-model:show="addModal"
      :tabArrs="tabArrs"
      @refresh="getListBooks"
      :currentObj="currentObj"
    ></add-modalele>
  </global-tabs>
</template>

<script setup lang="ts">
  import { delCourse, getClassGrades, getCourseList } from "@/api/courseware"
  import addModalele from "./components/addModal.vue"
  import itemList from "./components/itemList.vue"
  const tabArrs = ref<any>([])
  const activeKey = ref<number>(0)
  const catalogueList = ref<any>([])
  const allClass = ref<any>([])
  const getInit = async () => {
    tabArrs.value = []
    allClass.value = []
    const res = await getClassGrades()
    res.map((v) => {
      let tabName = v.gradeName
      if (v.classList) {
        v.classList.forEach((item, index) => {
          allClass.value.push({
            value: item.id,
            label: item.name
          })
          if (index === 0) {
            tabName += `${item.specialityName}`
          }
          tabName += `${item.name}`
        })
      }
      tabArrs.value.push({
        tab: tabName,
        key: v.gradeId,
        label: tabName,
        value: v.gradeId
      })
    })
    activeKey.value = tabArrs.value[0].key
    getListBooks()
  }

  const getListBooks = async () => {
    const data = await getCourseList({ gradeId: activeKey.value })
    catalogueList.value = data
  }

  const itemStyle = computed(() => {
    return {
      width: "120px",
      height: "206px",
      borderRadius: "4px",
      flexShrink: 0,
      margin: "0 22px 22px 0",
      cursor: "pointer"
    }
  })

  const currentObj = ref<any>({})

  const addModal = ref<boolean>(false)
  const handleAdd = () => {
    currentObj.value = {}
    addModal.value = true
  }

  const handleEdit = (item: any) => {
    currentObj.value = item
    addModal.value = true
  }

  import { useBottom } from "@/hooks/useModalDel"
  import { message } from "ant-design-vue"
  const { uConfirm } = useBottom()
  const handleDel = (item: any) => {
    uConfirm(`${item.name}课本`, async () => {
      const data = await delCourse([item.id])
      if (data) {
        message.success("删除成功")
      }
      getListBooks()
    })
  }

  onMounted(() => {
    getInit()
  })
</script>

<style lang="less" scoped>
  .courseware {
    height: 100%;

    &__box {
      flex-wrap: wrap;
      height: 100%;
    }
  }

  // ::v-deep(.ant-tabs .ant-tabs-content-holder),
  // ::v-deep(.ant-tabs-content),
  // ::v-deep(.ant-tabs-content-holder) {
  //   height: 100%;
  // }
</style>
