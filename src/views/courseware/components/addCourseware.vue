<template>
  <global-modal
    :title="modaleTitle"
    :show="show"
    :loading="btnOkLoading"
    :isOk="!isView"
    @ok="handleOk"
    @closed="handleClosed"
    @update:show="emit('update:show', false)"
  >
    <a-form ref="formRef" layout="vertical" :rules="rules" :model="formData">
      <a-form-item name="coursewareList" label="" style="margin-top: 10px">
        <global-upload
          v-model:value="formData.coursewareList"
          btnName="上传课件"
          :disabled="isView"
          @change="validateFieldFun"
        ></global-upload>
      </a-form-item>
    </a-form>
  </global-modal>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      show: boolean
      currentObj?: any
      isView?: boolean
    }>(),
    {
      show: false,
      currentObj: () => {},
      isView: false
    }
  )

  const modaleTitle = computed(() => {
    return props.isView ? "查看课件" : "配置课件"
  })

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

  const validateFieldFun = () => {
    setTimeout(() => {
      formRef.value.clearValidate(["coursewareList"])
    }, 100)
  }
</script>

<style lang="less" scoped></style>
