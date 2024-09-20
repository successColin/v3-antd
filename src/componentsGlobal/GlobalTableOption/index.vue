<template>
  <div class="globalTableOption">
    <div v-for="(v, i) in value" :key="i" class="globalTableOption__item">
      <a-form-item-rest>
        <global-input v-model:value="v.option" placeholder="请输入"></global-input>
      </a-form-item-rest>
      <div style="width: 28px; height: 28px">
        <img @click="handleDel(i)" v-show="value.length > 1" src="~@/assets/images/delete1.png" alt="" />
      </div>
    </div>
    <div class="globalTableOption__add" @click="handleClickAdd"> + </div>
  </div>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      value: Array<any>
      initOption?: Record<string, any>
    }>(),
    {
      value: () => []
    }
  )

  const emit = defineEmits(["add", "del"])
  const handleClickAdd = () => {
    emit("add")
  }
  const handleDel = (i: number) => {
    emit("del", i)
  }
</script>

<style lang="less" scoped>
  .globalTableOption {
    &__item {
      display: flex;
      align-items: center;
      margin-bottom: 4px;
      img {
        width: 100%;
        height: 100%;
        flex-shrink: 0;
        padding: 4px;
        cursor: pointer;
      }
    }
    &__add {
      height: 32px;
      background: #e6f7ff;
      border-radius: 2px;
      margin-right: 28px;

      color: #1890ff;
      font-size: 24px;
      text-align: center;
      line-height: 27px;
      cursor: pointer;
      margin-top: 4px;
    }
  }
</style>
