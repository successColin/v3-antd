<template>
  <div v-for="v in list" :key="v" class="itemList flex-cc">
    <div class="itemList__img">
      <img :src="v.cover" alt="图片不存在" />
      <div class="itemList__img--del flex-cc" @click="handleDelete(v)" v-if="isConfig">
        <img src="~@/assets/images/delete.png" alt="" />
        <div>删除</div>
      </div>
      <div class="itemList__img--mask oneLine" :title="v.name">
        {{ v.name }}
      </div>
    </div>
    <div class="oneLine" :title="v.name">
      <div class="itemList__edit" v-if="isConfig">
        <a-button primary block @click="handleEdit(v)">编辑</a-button>
      </div>
      <a-button type="primary" block @click="handleJump(v)">进入</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      list: Array<any>
      isConfig?: boolean
    }>(),
    {
      isConfig: true
    }
  )

  const emit = defineEmits(["edit", "del", "jump"])

  const handleEdit = (v) => {
    emit("edit", v)
  }
  const handleDelete = (v) => {
    emit("del", v)
  }
  const handleJump = (v) => {
    emit("jump", v)
  }
</script>

<style lang="less" scoped>
  .itemList {
    overflow: hidden;
    background: #f2f8f7;
    border-radius: 8px;
    width: 160px;
    height: 272px;
    flex-shrink: 0;
    margin: 0 22px 22px 0;
    cursor: pointer;
    &__img {
      position: relative;
      flex: 1;
      & > img {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      &--mask {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 42px;
        line-height: 42px;
        text-align: center;
        background: linear-gradient(180deg, rgba(34, 34, 34, 0) 0%, #222222 100%);
        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: bold;
        font-size: 14px;
        color: #ffffff;
        text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
        padding: 0 10px;
      }
      &--del {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 40px;
        height: 46px;

        background: rgba(255, 255, 255, 0.75);
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
        border-radius: 4px;

        font-family:
          PingFang SC,
          PingFang SC;
        font-weight: 500;
        font-size: 12px;
        color: #1890ff;
        line-height: 22px;
        line-height: 1;

        & > img {
          width: 16px;
          height: 16px;
          margin-bottom: 4px;
        }
      }
    }

    &__edit {
      margin-right: 8px;
    }

    & > div:nth-child(2) {
      height: 42px;
      padding: 8px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
    }
  }
</style>
