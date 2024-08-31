<script setup lang="ts">
  import { computed } from "vue"
  // import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router'
  import { useUserStore } from "@/store/modules/user"
  import { useRoute } from "vue-router"

  defineOptions({
    name: "LayoutBreadcrumb"
  })

  // const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()

  // 点击菜单
  // const clickMenuItem = (menuItem: RouteRecordRaw) => {
  //   const { isExt, extOpenMode, type } = menuItem?.meta || {}

  //   if (type === 0 && !menuItem.redirect) return

  //   if (isExt && extOpenMode === 1) {
  //     window.open(menuItem.path)
  //   } else {
  //     const to = typeof menuItem.redirect === 'string' ? menuItem.redirect : menuItem
  //     router.push(to)
  //   }
  // }

  const menus = computed(() => {
    if (route.meta?.namePath) {
      let children = userStore.menus
      const paths = route.meta?.namePath?.map((item) => {
        const a = children.find((n) => n.name === item)
        children = a?.children || []
        return a
      })
      return [
        {
          name: "__index",
          meta: {
            title: "首页"
          },
          children: userStore.menus
        },
        ...paths
      ]
    }
    return route.matched
  })

  // const getSelectKeys = (rotueIndex: number) => {
  //   return [menus.value[rotueIndex + 1]?.name] as string[]
  // }

  const goBack = () => {
    // router.go(-1)
    window.history.back()
  }
</script>

<template>
  <div class="breadcrumb flex items-center">
    <span @click="goBack" class="breadcrumb__back cursor-pointer">返回<span style="margin: 0 7px">></span></span>
    <a-breadcrumb separator=">">
      <template v-for="routeItem in menus" :key="routeItem?.name">
        <a-breadcrumb-item>
          <span class="cursor-pointer">{{ routeItem?.meta?.title }}</span>
          <!-- <template v-if="routeItem?.children?.length" #overlay>
            <a-menu :selected-keys="getSelectKeys(rotueIndex)">
              <template v-for="childItem in routeItem?.children" :key="childItem.name">
                <a-menu-item
                  v-if="!childItem.meta?.hideInMenu && !childItem.meta?.hideInBreadcrumb"
                  :key="childItem.name"
                  @click="clickMenuItem(childItem)"
                >
                  <span>{{ childItem.meta?.title }}</span>
                </a-menu-item>
              </template>
            </a-menu>
          </template> -->
        </a-breadcrumb-item>
      </template>
    </a-breadcrumb>
  </div>
</template>

<style lang="less" scoped>
  .breadcrumb {
    &__back {
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      font-family: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'";
    }
  }
</style>
