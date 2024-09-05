<template>
  <global-modal
    :title="title"
    :show="show"
    :loading="btnOkLoading"
    @ok="handleOk"
    @closed="handleClosed"
    @update:show="emit('update:show', false)"
  >
    <a-form ref="formRef" layout="vertical" :rules="rules" :model="formData">
      <a-form-item name="name" :label="formLabel">
        <global-input v-model:value="formData.name" :placeholder="`请输入${formLabel}`" />
      </a-form-item>
    </a-form>
  </global-modal>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      show: boolean
      title?: string
      parentId?: number
      modelType?: number
      currentObj?: any
    }>(),
    {
      show: false,
      title: "",
      modelType: 2,
      currentObj: () => {}
    }
  )

  const formLabel = computed(() => {
    return props.modelType === 2 ? "篇目录" : props.modelType === 3 ? "章目录" : "节目录"
  })

  // #region 表单
  import { addCourse, editCourse } from "@/api/courseware"
  import { message } from "ant-design-vue"
  import type { Rule } from "ant-design-vue/es/form"
  const DEFAULT_FORM_DATA: any = {
    name: "",
    parentId: "",
    type: "",
    id: ""
  }
  const formData = ref(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)))
  const rules: Record<string, Rule[]> = reactive({
    name: [{ required: true, message: "请输入目录", trigger: ["change", "blur"] }]
  })
  const btnOkLoading = ref<boolean>(false)
  const formRef = ref()
  const handleOk = () => {
    console.log("formData", formData.value)
    formRef.value.validate().then((v) => {
      btnOkLoading.value = true
      const api = formData.value.id ? editCourse : addCourse
      api(formData.value)
        .then(() => {
          message.success(formData.value.id ? "修改成功" : "新增成功")
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
      if (v) {
        formData.value.parentId = props.parentId
        formData.value.type = props.modelType
        if (Object.keys(props.currentObj).length) {
          console.log(1111111111, props.currentObj)
          formData.value.name = props.currentObj.name
          formData.value.id = props.currentObj.id
        }
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
