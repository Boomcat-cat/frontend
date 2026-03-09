import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite' // 👉 引入 Tailwind 插件

// 整个文件只能有这一个 export default
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(), // 👉 把插件加到这里
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})