<template>
  <!-- :before-upload="beforeUpload" -->
  <a-upload :file-list="value" :max-count="maxCount" :customRequest="doUpload" multiple :disabled="disabled" @change="handleChange">
    <a-button class="flex items-center" type="primary" v-if="!disabled">
      <UploadOutlined />
      {{ btnName }}
    </a-button>
    <div class="upload__title" v-if="value.length">已上传的课件</div>
    <template #itemRender="{ file }">
      <div class="upload__box flex-bc">
        <div class="flex">
          <div style="flex-shrink: 1">
            <global-icon :size="25" :icon="parseMimeTypeToIconName(file.fileName)" type="svg" />
          </div>
          <div class="m-l-4px">
            <div>{{ file.fileName }}</div>
            <div>{{ file.fileSize }}</div>
          </div>
        </div>
        <div style="padding: 10px; cursor: pointer" @click="handleDelete(file)" v-if="!disabled">
          <img src="~@/assets/images/delete1.png" alt="" style="width: 20px; height: 20px" />
        </div>
      </div>
    </template>
  </a-upload>
  <template v-if="!value.length">
    <global-nodata-two></global-nodata-two>
  </template>
  <!-- <global-view-file :isVisible="true"></global-view-file> -->
</template>

<script setup lang="ts">
  import { parseMimeTypeToIconName } from "@/utils"
  import { UploadOutlined } from "@ant-design/icons-vue"

  const props = withDefaults(
    defineProps<{
      value: any[]
      btnName?: string
      maxCount?: number
      limitSize?: Array<any>
      disabled?: boolean
    }>(),
    {
      value: () => [],
      btnName: "上传",
      limitSize: () => [],
      disabled: false
    }
  )

  // import { message } from "ant-design-vue"
  // const beforeUpload = async (file: any) => {
  //   console.log(file)
  //   const isJpgOrPng = file.type.indexOf("image") !== -1
  //   if (!isJpgOrPng) {
  //     message.error("请上传图片")
  //   }
  //   const fileUrl = URL.createObjectURL(file)
  //   const { width: imgWidth, height: imgHeight } = (await getImageSize(fileUrl)) as any
  //   let isLimitSize = true
  //   if (props.limitSize.length === 2) {
  //     const [width, height] = props.limitSize
  //     if (width !== imgWidth || height !== imgHeight) {
  //       isLimitSize = false
  //       message.error(`图片尺寸要求宽：${width}、高：${height}`)
  //     }
  //   }
  //   URL.revokeObjectURL(fileUrl)
  //   return isJpgOrPng && isLimitSize
  // }
  // function getImageSize(src) {
  //   return new Promise((resolve, reject) => {
  //     const img = new Image()
  //     img.onload = function () {
  //       const width = img.width
  //       const height = img.height
  //       resolve({ width, height })
  //     }
  //     img.src = src
  //   })
  // }

  import { fileUpload } from "@/api/home"
  const emit = defineEmits(["update:value", "change"])
  const doUpload = async (param: any) => {
    const { file } = param
    const formData = new FormData()
    formData.append("files", file)
    const data = await fileUpload(formData)
    const { fileName, url } = data[0]
    const fileSize = (file.size / 1024).toFixed(2) + "kb"
    const arr = [...props.value, { url, fileName, fileSize, type: parseMimeTypeToIconName(fileName, true) }]
    emit("update:value", arr)
  }

  const handleDelete = (file) => {
    const arr = props.value.filter((item) => item.url !== file.url)
    emit("update:value", arr)
  }

  const handleChange = () => {
    emit("change")
  }
</script>

<style lang="less" scoped>
  .upload__title {
    font-family:
      PingFang SC,
      PingFang SC;
    font-weight: bold;
    font-size: 14px;
    color: #222222;
    margin-top: 18px;
  }
  .upload__box {
    border-radius: 4px;
    border: 1px solid #e7e7e7;
    padding: 8px;
    margin-top: 8px;
    cursor: pointer;
  }
</style>
