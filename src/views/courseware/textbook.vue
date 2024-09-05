<template>
  <global-tabs :tabArrs="tabArrs" v-model:activeKey="activeKey" class="courseware" @change="getListBooks">
    <template #rightExtra>
      <a-button type="primary" @click="handleAdd">添加课本</a-button>
    </template>
    <div class="flex courseware__box">
      <item-list v-if="catalogueList.length" :list="catalogueList" @edit="handleEdit" @del="handleDel"></item-list>
      <global-nodate
        v-else
        :desc="`当前还没有${activeKey === 1 ? '理论课本' : '面试课本'}哦，请先添加新课本`"
        mt="13vh"
      ></global-nodate>
    </div>
    <add-modalele
      v-model:show="addModal"
      @refresh="getListBooks"
      :currentObj="currentObj"
      :tabArrs="tabArrs"
    ></add-modalele>
  </global-tabs>
</template>

<script setup lang="ts">
  import { delCourse, getCourseList } from "@/api/courseware"
  import addModalele from "./components/addModal.vue"
  import itemList from "./components/itemList.vue"

  const tabArrs = [
    {
      label: "理论课本",
      value: 1
    },
    {
      label: "面试课本",
      value: 5
    }
  ]
  const activeKey = ref<number>(1)
  const catalogueList = ref<any>([])
  const getListBooks = async () => {
    const data = await getCourseList({ bookType: activeKey.value })
    catalogueList.value = data
  }
  getListBooks()

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
    uConfirm(`删除${item.name}课本`, async () => {
      const data = await delCourse([item.id])
      if (data) {
        message.success("删除成功")
      }
      getListBooks()
    })
  }
</script>

<style lang="less" scoped>
  .courseware {
    height: 100%;

    &__box {
      flex-wrap: wrap;
      height: 100%;
      overflow: auto;
    }
  }
</style>
