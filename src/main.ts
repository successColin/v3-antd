import { setupAntd, setupAssets, setupGlobalMethods } from '@/plugins';
import { setupStore } from '@/store';
import 'core-js/actual/promise/with-resolvers';
import { createApp } from 'vue';
import App from './App.vue';
import { setupIcons } from './components/basic/icon';
import { setupRouter } from './router';

const app = createApp(App);

function setupPlugins() {
  // 安装图标
  setupIcons();
  // 注册全局常用的ant-design-vue组件
  setupAntd(app);
  // 引入静态资源
  setupAssets();
  // 注册全局方法，如：app.config.globalProperties.$message = message
  setupGlobalMethods(app);
}

async function setupApp() {
  // 挂载vuex状态管理
  setupStore(app);

  // 挂载路由
  await setupRouter(app);

  app.mount('#app');
}

setupPlugins();

setupApp();
