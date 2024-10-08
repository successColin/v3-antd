<template>
  <global-modal
    :title="modaleTitle"
    :show="show"
    :loading="btnOkLoading"
    @ok="handleOk"
    @closed="handleClosed"
    @update:show="emit('update:show', false)"
  >
    <a-form ref="formRef" layout="vertical" :rules="rules" :model="formData">
      <a-form-item name="name" label="课本名称">
        <global-input v-model:value="formData.name" placeholder="请输入课本名称" />
      </a-form-item>
      <a-form-item name="type" label="课本类型">
        <global-radio v-model:value="formData.type" :options="tabArrs"></global-radio>
      </a-form-item>
      <a-form-item name="fileList" label="课本封面">
        <global-upload-Avatar
          v-model:fileList="formData.fileList"
          :limitSize="[160, 224]"
          limitDesc="160 * 224"
        ></global-upload-Avatar>
      </a-form-item>
    </a-form>
  </global-modal>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      show: boolean
      tabArrs?: any[]
      currentObj?: any
    }>(),
    {
      show: false,
      tabArrs: () => [],
      currentObj: () => {}
    }
  )

  // #region
  import { addCourse, editCourse } from "@/api/courseware"
  import { message } from "ant-design-vue"
  import type { Rule } from "ant-design-vue/es/form"
  const DEFAULT_FORM_DATA: any = {
    cover: "",
    name: "",
    parentId: 0,
    type: "",
    fileList: []
  }
  const formData = ref(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)))
  const rules: Record<string, Rule[]> = reactive({
    name: [{ required: true, message: "请输入课本名称", trigger: ["change", "blur"] }],
    type: [{ required: true, message: "请选择课本类型", trigger: ["change", "blur"] }],
    fileList: [{ required: true, message: "请上传课本封面", trigger: ["change"] }]
  })
  const btnOkLoading = ref<boolean>(false)
  const formRef = ref()
  const handleOk = () => {
    formRef.value.validate().then((v) => {
      btnOkLoading.value = true
      const api = formData.value.id ? editCourse : addCourse
      api({
        ...formData.value,
        cover: formData.value.fileList[0].url
      })
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

  const modaleTitle = computed(() => {
    return formData.value.id ? "编辑课本" : "新建课本"
  })

  watch(
    () => props.show,
    (v) => {
      if (v && JSON.stringify(props.currentObj) !== "{}") {
        formData.value = JSON.parse(JSON.stringify(props.currentObj))
        formData.value.fileList = [
          {
            url: props.currentObj.cover
          }
        ]
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
