<template>
  <a-upload
    :file-list="fileList"
    name="avatar"
    list-type="picture-card"
    class="avatar"
    :before-upload="beforeUpload"
    :max-count="1"
    :customRequest="doUpload"
    @remove="handleRemove"
  >
    <div v-if="!imageUrl" class="avatar__btn">
      <img src="~@/assets/images/upload.png" alt="" style="width: 24px; height: 24px; margin-bottom: 6px" />
      <div>图片尺寸</div>
      <div>{{ limitDesc }}</div>
    </div>
  </a-upload>
</template>
<script lang="ts" setup>
  import { message } from "ant-design-vue"

  const props = withDefaults(
    defineProps<{
      fileList?: Array<any>
      limitSize?: Array<any>
      limitDesc?: string
    }>(),
    {
      fileList: () => [],
      limitSize: () => [],
      limitDesc: "120 * 126"
    }
  )

  const loading = ref<boolean>(false)
  const imageUrl = ref<string>("")
  const emit = defineEmits(["update:fileList"])

  import { fileUpload } from "@/api/home"
  const doUpload = async (param: any) => {
    loading.value = true
    const { file } = param
    const formData = new FormData()
    formData.append("files", file)
    const data = await fileUpload(formData)
    console.log(data)
    imageUrl.value = data[0].url
    const arr = [...props.fileList, { url: imageUrl.value }]
    loading.value = false
    emit("update:fileList", arr)
  }

  const handleRemove = (file: any) => {
    const arr = props.fileList.filter((item) => item.url !== file.url)
    imageUrl.value = ""
    emit("update:fileList", arr)
  }

  watch(
    () => props.fileList,
    (val) => {
      console.log(val)
      if (val.length > 0) {
        imageUrl.value = val[0].url
      } else {
        imageUrl.value = ""
      }
    },
    {
      deep: true
    }
  )

  function getImageSize(src) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = function () {
        const width = img.width
        const height = img.height
        resolve({ width, height })
      }
      img.src = src
    })
  }

  const beforeUpload = async (file: any) => {
    console.log(file)
    const isJpgOrPng = file.type.indexOf("image") !== -1
    if (!isJpgOrPng) {
      message.error("请上传图片")
    }
    const fileUrl = URL.createObjectURL(file)
    const { width: imgWidth, height: imgHeight } = (await getImageSize(fileUrl)) as any
    let isLimitSize = true
    if (props.limitSize.length === 2) {
      const [width, height] = props.limitSize
      if (width !== imgWidth || height !== imgHeight) {
        isLimitSize = false
        message.error(`图片尺寸要求宽：${width}、高：${height}`)
      }
    }
    URL.revokeObjectURL(fileUrl)
    return isJpgOrPng && isLimitSize
  }
</script>
<style lang="less" scoped>
  ::v-deep(.ant-upload.ant-upload-select),
  ::v-deep(.ant-upload-list-item-container) {
    width: 120px !important;
    height: 170px !important;
  }

  ::v-deep(.ant-upload.ant-upload-select) {
    background-color: #fff !important;
  }

  .avatar {
    &__btn {
      color: #666;
      font-size: 12px;
    }
  }
</style>
