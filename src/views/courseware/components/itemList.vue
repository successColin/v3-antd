<template>
  <div v-for="v in list" :key="v" class="itemList flex-cc" :style="itemStyle">
    <div class="itemList__img">
      <img :src="v.cover" alt="图片不存在" />
      <div class="itemList__img--mask">
        <div class="itemList__btn">
          <div @click="handleDelete(v)">
            <img src="~@/assets/images/delete.png" alt="" />
            <div>删除</div>
          </div>
          <div @click="handleEdit(v)">
            <img src="~@/assets/images/edit.png" alt="" />
            <div>编辑</div>
          </div>
        </div>
      </div>
    </div>
    <div class="oneLine" :title="v.name">{{ v.name }}</div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      list: Array<any>
      itemStyle: any
    }>(),
    {}
  )

  const emit = defineEmits(["edit", "del"])

  const handleEdit = (v) => {
    emit("edit", v)
  }
  const handleDelete = (v) => {
    emit("del", v)
  }
</script>

<style lang="less" scoped>
  .itemList {
    border: 1px solid #d9d9d9;
    overflow: hidden;
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
        top: 0;
        left: 0;
        width: 100%;
        height: 0;
        background: rgba(34, 34, 34, 0.5);
        .itemList__btn {
          width: 100%;
          position: absolute;
          bottom: 5px;
          display: flex;
          justify-content: space-around;
          & > div {
            text-align: center;

            font-family:
              PingFang SC,
              PingFang SC;
            font-weight: 500;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);

            & > img {
              width: 16px;
              height: 16px;
            }
          }
        }
      }
    }
    &__img:hover {
      .itemList__img--mask {
        height: 100%;
        transition: all 0.3s;
      }
    }
    & > div:nth-child(2) {
      height: 36px;
      padding: 0 10px;
      width: 100%;
      text-align: center;
      line-height: 36px;
    }
  }
</style>
