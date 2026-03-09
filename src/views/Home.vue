<template>
  <div class="min-h-screen w-screen bg-slate-900 flex flex-col font-sans text-slate-200 relative overflow-x-hidden">
    
    <div class="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
    <div class="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

    <nav class="h-16 flex items-center justify-between px-8 bg-slate-900/60 backdrop-blur-2xl border-b border-slate-700/50 z-20">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20">
          <world theme="outline" size="18" fill="#fff"/>
        </div>
        <span class="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">水体遥感监测智能分析平台</span>
      </div>
      
      <div class="flex items-center gap-4">
        <template v-if="username">
          <span class="text-sm font-bold text-slate-400 mr-2">Welcome, {{ username }}</span>
          
          <button @click="goToUserCenter" class="flex items-center gap-2 text-sm text-blue-400 hover:text-white font-bold px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:bg-blue-600 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all">
            <el-icon><User /></el-icon> 任务中心
          </button>
          
          <button @click="handleLogout" class="text-sm text-rose-400 hover:text-white font-bold px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-600 hover:shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all">
            退出
          </button>
        </template>
        <template v-else>
          <button @click="goLogin" class="text-sm text-white font-bold px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/30 transition-all active:scale-95">
            系统登录
          </button>
        </template>
      </div>
    </nav>

    <div class="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
      
      <div class="text-center mb-16 animate-fade-in-up">
        <h1 class="text-5xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 drop-shadow-sm tracking-tight">多源遥感 · 智能分析</h1>
        <p class="text-lg text-slate-400 font-medium tracking-wide">无人机 + 卫星双源水体监测 | 全流程自动化计算 | 水质要素高精度反演</p>
      </div>

      <div class="flex gap-8 flex-wrap justify-center max-w-5xl">
        
        <div @click="goToDrone" class="w-80 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-blue-500/50 group cursor-pointer relative overflow-hidden animate-fade-in-up" style="animation-delay: 100ms">
          <div class="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform duration-300">
            <drone theme="outline" size="40" fill="#fff"/>
          </div>
          <h3 class="text-2xl font-bold text-white mb-4 drop-shadow-md">无人机水体监测</h3>
          <ul class="space-y-3 text-slate-400 text-sm mb-8 font-medium">
            <li class="flex items-center justify-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]"></span> 亚米级高精影像上传</li>
            <li class="flex items-center justify-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]"></span> 水质参数微观自动反演</li>
            <li class="flex items-center justify-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_#3b82f6]"></span> 自动化可视化报告生成</li>
          </ul>
          <button class="w-full py-3.5 rounded-xl font-bold text-white bg-slate-800 border border-slate-600/50 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all active:scale-95">
            启动近端计算引擎
          </button>
        </div>

        <div @click="goToSatellite" class="w-80 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:border-emerald-500/50 group cursor-pointer relative overflow-hidden animate-fade-in-up" style="animation-delay: 200ms">
          <div class="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-300">
            <receiver theme="outline" size="40" fill="#fff"/>
          </div>
          <h3 class="text-2xl font-bold text-white mb-4 drop-shadow-md">卫星水体监测</h3>
          <ul class="space-y-3 text-slate-400 text-sm mb-8 font-medium">
            <li class="flex items-center justify-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></span> 高分卫星大范围覆盖</li>
            <li class="flex items-center justify-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></span> 宏观 FUI 水色指数全境计算</li>
            <li class="flex items-center justify-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></span> 蓝藻水华长效预警追踪</li>
          </ul>
          <button class="w-full py-3.5 rounded-xl font-bold text-white bg-slate-800 border border-slate-600/50 group-hover:bg-emerald-600 group-hover:border-emerald-500 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all active:scale-95">
            启动广域分析引擎
          </button>
        </div>
      </div>
    </div>

    <footer class="py-6 text-center text-xs font-mono text-slate-500 border-t border-slate-800/80 z-10 bg-slate-950/50 backdrop-blur-md">
      <p>SYS_VER: 3.1.0-RC | © 2026 水体遥感监测智能分析平台. ALL RIGHTS RESERVED.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Drone, World, Receiver } from '@icon-park/vue-next'
// 引入新增的 User 图标
import { User } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '')

const goToDrone = () => router.push('/drone')
const goToSatellite = () => router.push('/satellite')
const goLogin = () => router.push('/login')

// ★ 新增：跳转任务中心的方法
const goToUserCenter = () => {
  router.push('/user-center')
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('isAdmin')
  username.value = ''
  ElMessage.success('系统已安全退出')
}
</script>

<style scoped>
/* 定义卡片出场时的平滑上浮动画 */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0; /* 初始隐藏，等动画赋予透明度 */
}
</style>