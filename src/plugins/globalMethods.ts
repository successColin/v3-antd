import type { App } from 'vue';

// import useFormModal from '@/hooks/useFormModal'
// import useModal from '@/hooks/useModal/index';
import permission from '@/permission';
/**
 * 注册全局方法
 * @param app
 */
export function setupGlobalMethods(app: App) {
  app.use(permission);
  // app.use(useFormModal)
  // app.use(useModal);
  // 全局挂载Reflect反射对象,以便在vue模板中使用
  app.config.globalProperties.Reflect = Reflect;
}

export function registerGlobalComponents(app: App) {
  const components = import.meta.glob("../components/**/index.vue")
  for (const [path, resolve] of Object.entries(components)) {
    const arr = path.split("/")
    const componentName = arr[arr.length - 2]
    const asyncComponent = defineAsyncComponent(() => resolve().then((mod) => (mod as any).default))
    app.component(componentName, asyncComponent)
  }
}