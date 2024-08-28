<!-- 对话框 -->
<template>
  <div>
    <a-card>
      <a-button type="primary" @click="state.visible = true">普通组件方式</a-button>
      <a-button type="primary" @click="handleOpenUseModal">useModal组件方式</a-button>
      <a-button type="primary" @click="handleOpenHookModal">hook纯函数式</a-button>
    </a-card>
    <DraggableModal v-model:open="state.visible" @ok="onOk" />
    <UseModalComp />
  </div>
</template>

<script setup lang="tsx">
  import { reactive } from 'vue'
  import { DraggableModal } from '@/components/core/draggable-modal'
  import { useModal } from '@/hooks/useModal'

  defineOptions({
    name: 'CustomModal'
  })

  /**
   * @description 扩展ant-design-vue模态框功能
   */

  const [fnModal] = useModal()
  const [UseModalComp] = useModal()

  const state = reactive({
    visible: false
  })

  const handleOpenHookModal = () => {
    fnModal.show({
      title: '我是hook纯函数式模态框',
      content: 'hello'
    })
  }
  const handleOpenUseModal = () => {
    UseModalComp.show({
      title: '我是UseModalComp',
      content: '嘿嘿嘿'
    })
  }

  const onOk = () => {
    state.visible = false
  }
</script>

<style scoped></style>
