<template>
  <div>
    <a-card>
      <schema-form ref="dynamicForm" v-bind="formProps" @submit="confirm" />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { message } from 'ant-design-vue'
  import { schemas } from './form-schema'
  import { SchemaForm, type SchemaFormProps } from '@/components/core/schema-form'

  defineOptions({
    name: 'DemosFormRuleForm'
  })

  /**
   * @description 验证表单
   */
  const dynamicForm = ref<InstanceType<typeof SchemaForm>>()
  const formProps: SchemaFormProps = { schemas, labelWidth: 120, actionColOptions: { span: 24 } }

  // 点击提交
  function confirm(values) {
    dynamicForm.value?.validate().then(() => {
      message.success(JSON.stringify(values))
    })
  }
</script>

<style lang="less" scoped>
  .btn-rows {
    button {
      margin-right: 12px;
    }
  }
</style>
