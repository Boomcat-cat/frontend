<template>
  <div class="min-h-screen w-screen bg-slate-900 flex flex-col font-sans text-slate-200 relative overflow-x-hidden">
    <div class="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
    <div class="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

    <nav class="h-16 flex items-center justify-between px-8 bg-slate-900/60 backdrop-blur-2xl border-b border-slate-700/50 z-20 sticky top-0">
      <div class="flex items-center gap-6">
        <button @click="router.push('/')" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white font-bold transition-colors px-3 py-2 rounded-xl hover:bg-slate-800/50">
          <el-icon><ArrowLeft /></el-icon> 返回首页
        </button>
        <h2 class="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">COMMAND CENTER</h2>
      </div>
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 border border-white/20">
          {{ username.charAt(0).toUpperCase() }}
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold text-slate-200">{{ username }}</span>
          <span class="text-[10px] text-emerald-400 tracking-widest uppercase">Authorized Agent</span>
        </div>
      </div>
    </nav>

    <div class="flex-1 w-full max-w-[1400px] mx-auto p-8 relative z-10">
      
      <div class="flex justify-between items-end mb-8 border-b border-slate-700/50 pb-4">
        <div>
          <h1 class="text-3xl font-black text-white mb-2">我的遥感计算任务</h1>
          <p class="text-sm text-slate-400">实时追踪任务进度，查阅历史监测报告与反演数据。</p>
        </div>
        <button @click="fetchRecords" class="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-colors border border-slate-600">
          <el-icon :class="{'is-loading': loading}"><Refresh /></el-icon> 刷新状态
        </button>
      </div>

      <div v-if="records.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="task in records" :key="task.id" 
             class="bg-slate-800/40 backdrop-blur-xl border rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20 group flex flex-col"
             :class="task.status === '已完成' ? 'border-slate-600/50 hover:border-emerald-500/50' : 'border-blue-500/30 hover:border-blue-400/60'">
          
          <div class="flex justify-between items-start mb-4">
            <div>
              <div class="text-[10px] text-slate-400 font-mono tracking-widest uppercase mb-1">TASK_ID</div>
              <div class="font-mono font-bold text-slate-200">{{ task.task_id }}</div>
            </div>
            <div class="px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2"
                 :class="task.status === '已完成' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-blue-500/10 text-blue-400 border-blue-500/30'">
              <span v-if="task.status !== '已完成'" class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
              <span v-else class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {{ task.status === '已完成' ? '分析完成' : '云端计算中' }}
            </div>
          </div>

          <div class="flex-1 space-y-3 mb-6">
            <div class="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
              <div class="text-[10px] text-slate-500 mb-1">目标区域坐标</div>
              <div class="text-xs text-blue-300/80 font-mono line-clamp-2 leading-relaxed">{{ task.area }}</div>
            </div>
            <div class="flex justify-between text-xs text-slate-400">
              <span>影像云量: <span class="text-slate-200 font-bold">≤{{ task.cloud_cover }}%</span></span>
              <span>时间: <span class="text-slate-200">{{ task.create_time.split(' ')[0] }}</span></span>
            </div>
          </div>

          <div class="mt-auto">
            <button v-if="task.status === '已完成'" @click="goToResult(task.task_id)" class="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]">
              查看空间可视化大屏 🌍
            </button>
            <div v-else class="w-full bg-slate-800 border border-slate-700 text-slate-400 font-bold py-3 rounded-xl flex justify-center items-center gap-2 cursor-wait">
              <el-icon class="is-loading"><Loading /></el-icon> AI 引擎全速运算中...
            </div>
          </div>

        </div>
      </div>

      <div v-else-if="!loading" class="flex flex-col items-center justify-center py-32 opacity-60">
        <el-icon size="64" class="text-slate-600 mb-4"><Box /></el-icon>
        <p class="text-lg text-slate-400 font-bold">暂无遥感监测任务</p>
        <button @click="router.push('/satellite')" class="mt-4 text-blue-400 hover:text-blue-300 underline underline-offset-4">去创建一个吧</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Refresh, Loading, Box } from '@element-plus/icons-vue'

const router = useRouter()
const username = ref(localStorage.getItem('username') || 'Agent')
const records = ref([])
const loading = ref(false)
let timer = null

const fetchRecords = async () => {
  const token = localStorage.getItem('token')
  if (!token) return router.push('/login')
  
  loading.value = true
  try {
    const res = await axios.get('https://backend-1--ilenkaajennifer.replit.app/my-records', {
      headers: { Authorization: `Bearer ${token}` }
    })
    records.value = res.data
  } catch (err) {
    ElMessage.error('获取任务列表失败')
  } finally {
    loading.value = false
  }
}

const goToResult = (taskId) => {
  // 跳转到结果大屏，并带上任务ID
  router.push({ path: '/satellite/processing-result', query: { taskId } })
}

onMounted(() => {
  fetchRecords()
  // 每隔 3 秒自动静默刷新一次进度，让体验极致逼真
  timer = setInterval(() => {
    fetchRecords()
  }, 3000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
/* 保证加载图标能转起来 */
.is-loading {
  animation: rotating 2s linear infinite;
}
@keyframes rotating {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>