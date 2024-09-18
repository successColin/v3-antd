<template>
  <global-modal
    title="设置题目分值"
    :show="show"
    :loading="btnOkLoading"
    @ok="handleOk"
    @closed="handleClosed"
    @update:show="emit('update:show', false)"
  >
    <div> 设置的题型，不包括简答题；每道题最小分值为0.5分，且必须为0.5的倍数 </div>
    <a-form ref="formRef" layout="vertical" :rules="rules" :model="formData">
      <a-form-item name="coursewareList" label="判断题">
        <global-input></global-input>
      </a-form-item>
      <a-form-item name="coursewareList" label="单选题">
        <global-input></global-input>
      </a-form-item>
      <a-form-item name="coursewareList" label="多选题">
        <global-input></global-input>
      </a-form-item>
      <a-form-item name="coursewareList" label="填空题">
        <global-input></global-input>
      </a-form-item>
    </a-form>
  </global-modal>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      show: boolean
      currentObj?: any
    }>(),
    {
      show: false,
      currentObj: () => {}
    }
  )

  // #region
  import { addBatchCourseware } from "@/api/courseware"
  import { message } from "ant-design-vue"
  import type { Rule } from "ant-design-vue/es/form"
  const DEFAULT_FORM_DATA: any = {
    coursewareList: [],
    chapterId: ""
  }
  const formData = ref(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)))
  const rules: Record<string, Rule[]> = reactive({
    coursewareList: [{ required: true, message: "请上传课件", trigger: ["change", "blur"] }]
  })
  const btnOkLoading = ref<boolean>(false)
  const formRef = ref()
  const handleOk = () => {
    formRef.value.validate().then((v) => {
      btnOkLoading.value = true
      addBatchCourseware(formData.value)
        .then(() => {
          message.success("课件编辑成功")
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
      console.log(v)
      if (v && Object.keys(props.currentObj).length) {
        formData.value.coursewareList = props.currentObj.coursewareList || []
        formData.value.chapterId = props.currentObj.id
      }
    }
  )

  const emit = defineEmits(["update:show", "refresh"])

  const handleClosed = () => {
    formData.value = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA))
    formRef.value.resetFields()
  }
</script>

<style lang="less" scoped></style>
