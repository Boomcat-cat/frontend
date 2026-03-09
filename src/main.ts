import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 引入路由
import ElementPlus from 'element-plus' // 引入Element Plus
import 'element-plus/dist/index.css' // 引入Element Plus样式
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/main.css' 

const app = createApp(App)

// 注册所有Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus)
app.mount('#app')
