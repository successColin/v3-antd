<template>
  <global-tabs :tabArrs="tabArrs" v-model:activeKey="activeKey" class="courseware" @change="getListBooks">
    <div class="flex courseware__box">
      <item-list
        v-if="catalogueList.length"
        :isConfig="false"
        :list="catalogueList"
        @jump="handleJumpCatalog"
      ></item-list>
      <global-nodate
        v-else
        :desc="`当前还没有${activeKey === 1 ? '理论课本' : '面试课本'}哦，请先添加新课本`"
        mt="13vh"
      >
        <template #btn>
          <a-button style="padding: 4px 30px; margin: 10px 0" type="primary" @click="handleJumpTextbook">
            课本配置
          </a-button>
        </template>
      </global-nodate>
    </div>
  </global-tabs>
</template>

<script setup lang="ts">
  import { getCourseList } from "@/api/courseware"
  import itemList from "./components/itemList.vue"

  const tabArrs = [
    {
      label: "理论课本",
      value: 1
    }
  ]
  const activeKey = ref<number>(1)
  const catalogueList = ref<any>([])
  const getListBooks = async () => {
    const data = await getCourseList({ bookType: activeKey.value })
    catalogueList.value = data
  }
  getListBooks()

  import { useRouter } from "vue-router"
  const router = useRouter()
  const handleJumpTextbook = () => {
    router.push({ name: "courseware-textbook" })
  }

  const handleJumpCatalog = (v: any) => {
    router.push({ name: "courseware-configList", query: { id: v.id} })
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
