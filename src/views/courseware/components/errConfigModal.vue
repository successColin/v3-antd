<template>
  <global-modal
    class="errConfigModal"
    title="设置题目分值"
    :show="show"
    :loading="btnOkLoading"
    @ok="handleOk"
    @closed="handleClosed"
    @update:show="emit('update:show', false)"
  >
    <div class="errConfigModal__title"> 设置的题型，不包括简答题；每道题最小分值为0.5分，且必须为0.5的倍数 </div>
    <a-form ref="formRef" layout="vertical" :rules="rules" :model="formData">
      <a-form-item name="one" label="判断题">
        <global-input v-model:value="formData.one" type="number" placeholder="请输入判断题分值"></global-input>
      </a-form-item>
      <a-form-item name="two" label="单选题">
        <global-input v-model:value="formData.two" type="number" placeholder="请输入单选题分值"></global-input>
      </a-form-item>
      <a-form-item name="three" label="多选题">
        <global-input v-model:value="formData.three" type="number" placeholder="请输入多选题分值"></global-input>
      </a-form-item>
      <a-form-item name="four" label="填空题">
        <global-input v-model:value="formData.four" type="number" placeholder="请输入填空题分值"></global-input>
      </a-form-item>
    </a-form>
  </global-modal>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      show: boolean
      currentArr?: any
    }>(),
    {
      show: false,
      currentArr: () => {}
    }
  )

  // #region
  import { editExerciseConfig } from "@/api/courseware"
  import { message } from "ant-design-vue"
  import type { Rule } from "ant-design-vue/es/form"
  const DEFAULT_FORM_DATA: any = {
    one: 0,
    two: 0,
    three: 0,
    four: 0
  }
  const validateVal = (rule: Rule, value: number) => {
    if (!value) {
      return Promise.reject("请输入分值")
    }
    if (value <= 0) {
      return Promise.reject("请输入大于0的数")
    }
    if (value < 0.5 || value % 0.5 !== 0) {
      return Promise.reject("请输入0.5的倍数")
    }
    return Promise.resolve()
  }
  const formData = ref(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)))
  const rules: Record<string, Rule[]> = reactive({
    one: [{ required: true, validator: validateVal, trigger: "blur" }],
    two: [{ required: true, validator: validateVal, trigger: "blur" }],
    three: [{ required: true, validator: validateVal, trigger: "blur" }],
    four: [{ required: true, validator: validateVal, trigger: "blur" }]
  })
  const btnOkLoading = ref<boolean>(false)
  const formRef = ref()
  const handleOk = () => {
    formRef.value.validate().then((v) => {
      btnOkLoading.value = true
      const params = [
        { type: 1, score: formData.value.one },
        { type: 2, score: formData.value.two },
        { type: 3, score: formData.value.three },
        { type: 4, score: formData.value.four }
      ]
      editExerciseConfig(params)
        .then(() => {
          message.success("设置成功")
          emit("update:show", false)
          emit("refresh")
        })
        .catch((err) => {
          console.log("error", err)
        })
        .finally(() => {
          btnOkLoading.value = false
        })
    })
  }
  // #endregion

  watch(
    () => props.show,
    (v) => {
      if (v && props.currentArr.length) {
        props.currentArr.forEach((item) => {
          if (item.type === 1) {
            formData.value.one = item.score
          }
          if (item.type === 2) {
            formData.value.two = item.score
          }
          if (item.type === 3) {
            formData.value.three = item.score
          }
          if (item.type === 4) {
            formData.value.four = item.score
          }
        })
      }
      console.log("props.formData", formData.value)
    }
  )

  const emit = defineEmits(["update:show", "refresh"])

  const handleClosed = () => {
    formData.value = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA))
    formRef.value.resetFields()
  }
</script>

<style lang="less" scoped>
  .errConfigModal {
    &__title {
      font-family:
        PingFang SC,
        PingFang SC;
      font-weight: 500;
      font-size: 14px;
      color: #666666;
      padding: 5px 0 10px;
    }
  }
</style>
