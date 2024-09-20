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
      <a-form-item name="type" label="题目类型">
        <global-select v-model:value="formData.type" :option="noTopicType" placeholder="请输入题目类型"></global-select>
      </a-form-item>
      <a-form-item name="bookId" label="课本名称">
        <global-select
          v-model:value="formData.bookId"
          :option="catalogueList"
          placeholder="请选择课本名称"
          @change="handleChangeBook"
        ></global-select>
      </a-form-item>
      <a-form-item name="belongPath" label="课本目录">
        <global-cascader
          v-model:value="formData.belongPath"
          :option="catalogList"
          placeholder="请选择课本目录"
          :fieldNames="{ label: 'name', value: 'id', children: 'childNodes' }"
        ></global-cascader>
      </a-form-item>
      <a-form-item name="content" label="题目内容">
        <global-textarea v-model:value="formData.content" placeholder="请输入题目内容" />
      </a-form-item>
      <a-form-item name="judgeVal" label="题目答案" v-if="formData.type === 1">
        <global-radio
          v-model:value="formData.judgeVal"
          :options="questionAnswerType"
          @change="handleChangeJudgeVal"
        ></global-radio>
      </a-form-item>
      <a-form-item name="optionOk" label="正确选项" v-if="formData.type === 2">
        <global-table-option
          v-model:value="formData.optionOk"
          @add="handleAddOptionOk"
          @del="handleDelOptionOk"
        ></global-table-option>
      </a-form-item>
      <a-form-item name="optionErr" label="错误选项" v-if="formData.type === 2">
        <global-table-option
          v-model:value="formData.optionErr"
          @add="handleAddOptionErr"
          @del="handleDelOptionErr"
        ></global-table-option>
      </a-form-item>
      <a-form-item name="parse" label="答题解析">
        <global-textarea v-model:value="formData.parse" placeholder="请输入答题解析" />
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
      currentObj: {}
    }
  )

  // #region
  import { addExercise, editExercise, getCourseBookTree, getCourseList } from "@/api/courseware"
  import { noTopicType, questionAnswerType } from "@/constants/dict"
  import { message } from "ant-design-vue"
  import type { Rule } from "ant-design-vue/es/form"

  // {
  //   "attachment": "",
  //   "difficulty": 0,
  //   "score": 0,
  //   "sectionId": 0,
  //   "selectors": [
  //     {
  //       "isRight": true,
  //       "label": "",
  //       "option": "",
  //       "order": 0
  //     }
  //   ],
  // }

  const DEFAULT_FORM_DATA: any = {
    type: 2,
    bookId: null,
    belongPath: [],
    content: "",
    judgeVal: "",
    optionOk: [
      {
        isRight: true,
        option: "",
        order: 1
      }
    ],
    optionErr: [
      {
        isRight: false,
        option: "",
        order: 1
      }
    ],
    selectors: [],
    parse: ""
  }
  const validateVal = (rule: Rule, value: Array<any>) => {
    if (value.length) {
      const arr = value.filter((item) => !item.option)
      if (arr.length) {
        return Promise.reject(new Error("请输入选项内容"))
      }
    }
    return Promise.resolve()
  }
  const formData = ref(JSON.parse(JSON.stringify(DEFAULT_FORM_DATA)))
  const rules: Record<string, Rule[]> = reactive({
    type: [{ required: true, message: "请选择题目类型", trigger: "change" }],
    bookId: [{ required: true, message: "请选择课本名称", trigger: "change" }],
    belongPath: [{ required: true, message: "请选择课本目录", trigger: "change" }],
    content: [{ required: true, message: "请输入题目内容", trigger: "blur" }],
    judgeVal: [{ required: true, message: "请选择题目答案", trigger: "change" }],
    parse: [{ required: true, message: "请输入答题解析", trigger: "blur" }],
    optionOk: [{ required: true, validator: validateVal, trigger: "change" }],
    optionErr: [{ required: true, validator: validateVal, trigger: "change" }]
  })
  const btnOkLoading = ref<boolean>(false)
  const formRef = ref()
  const handleOk = () => {
    console.log("formData", formData.value)
    formRef.value.validate().then((v) => {
      btnOkLoading.value = true
      const api = formData.value.id ? editExercise : addExercise
      const params = formData.value
      if (formData.value.type === 2) {
        // formData.value.
      }
      api(params)
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

  // #region 选项
  const handleAddOptionErr = () => {
    const len = formData.value.optionErr?.length || []
    formData.value.optionErr.push({
      isRight: false,
      option: "",
      order: len + 1
    })
  }
  const handleDelOptionErr = (i) => {
    formData.value.optionErr.splice(i, 1)
    formData.value.optionErr = formData.value.optionErr.map((item, i) => {
      return {
        ...item,
        order: i + 1
      }
    })
  }
  const handleAddOptionOk = () => {
    const len = formData.value.optionOk?.length || []
    formData.value.optionOk.push({
      isRight: true,
      option: "",
      order: len + 1
    })
  }
  const handleDelOptionOk = (i) => {
    formData.value.optionOk.splice(i, 1)
    formData.value.optionOk = formData.value.optionOk.map((item, i) => {
      return {
        ...item,
        order: i + 1
      }
    })
  }
  // #endregion

  const modaleTitle = computed(() => {
    return formData.value.id ? "编辑题目(非解答题)" : "新建题目(非解答题)"
  })

  const catalogList = ref<any>([])
  const handleChangeBook = async (v, type = true) => {
    const data = await getCourseBookTree({ courseBookId: v, filterNoSection: true })
    catalogList.value = data
    if (type) {
      formData.value.belongPath = []
    }
  }

  const catalogueList = ref([])
  const getListBooks = async () => {
    const data = await getCourseList({ bookType: 1 })
    catalogueList.value = data.map((v) => {
      return {
        value: v.id,
        label: v.name
      }
    })
  }
  getListBooks()

  const handleChangeJudgeVal = (v) => {
    const arr = [
      {
        isRight: false,
        option: "正确",
        order: 1
      },
      {
        isRight: false,
        option: "错误",
        order: 2
      }
    ]
    formData.value.selectors = arr.map((item, i) => {
      return {
        ...item,
        isRight: i + 1 === v
      }
    })
  }

  watch(
    () => props.show,
    (v) => {
      if (v && JSON.stringify(props.currentObj) !== "{}") {
        formData.value = JSON.parse(JSON.stringify(props.currentObj))
        handleChangeBook(formData.value.bookId, false)
        if (formData.value.type === 1) {
          const obj = formData.value.selectors.find((v) => v.isRight)
          formData.value.judgeVal = obj.order
        }
        if (formData.value.type === 2) {
          const obj1 = formData.value.selectors.find((v) => v.isRight)
          formData.value.optionOk = obj1 || []
          const obj2 = formData.value.selectors.find((v) => !v.isRight)
          formData.value.optionErr = obj2 || []
        }
      }
    }
  )

  const emit = defineEmits(["update:show", "refresh"])

  const handleClosed = () => {
    formData.value = JSON.parse(JSON.stringify(DEFAULT_FORM_DATA))
    formRef.value.resetFields()
    catalogList.value = []
  }
</script>

<style lang="less" scoped></style>
