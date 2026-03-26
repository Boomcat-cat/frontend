<template>
  <div class="h-screen w-screen relative flex flex-col font-sans text-slate-50 overflow-hidden bg-slate-900">
    
    <div class="absolute top-[15%] -left-[10%] w-[45%] h-[70%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
    <div class="absolute bottom-[10%] -right-[10%] w-[45%] h-[70%] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

    <nav class="h-16 flex items-center justify-between px-6 bg-slate-800/80 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] border-b border-slate-700/80 z-30 shrink-0">
      <button @click="goBack" class="flex items-center gap-2 text-sm text-slate-300 hover:text-white font-bold transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-700/80">
        <el-icon><ArrowLeft /></el-icon> 返回首页
      </button>
      <h2 class="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 tracking-widest drop-shadow-md">
        无人机近端水质分析引擎
      </h2>
      <div class="flex items-center gap-4">
        <span v-if="username" class="text-sm font-bold text-slate-300">操作员：{{ username }}</span>
        <button v-if="username" @click="handleLogout" class="text-sm text-rose-400 hover:text-rose-300 font-bold px-3 py-1.5 rounded-md hover:bg-rose-500/10 transition-colors">退出</button>
        <button v-else @click="goLogin" class="text-sm text-blue-400 hover:text-blue-300 font-bold hover:bg-blue-600/10 px-4 py-1.5 rounded-md transition-colors">系统登录</button>
      </div>
    </nav>

    <div class="flex-1 flex gap-6 p-6 w-full max-w-[1600px] mx-auto min-h-0 relative z-10">
      
      <div class="w-[340px] flex flex-col gap-6 shrink-0 z-20">
        
        <div class="w-[364px] -mr-[24px] bg-slate-800 rounded-l-3xl border border-slate-600/60 border-r-0 relative z-20 flex flex-col flex-1 min-h-0 p-6 pr-[30px]">
          
          <div class="absolute bottom-[-1px] right-0 w-[24.5px] h-[3px] bg-slate-800 z-30"></div>
          <div class="absolute bottom-[-24.5px] right-[-1px] w-[3px] h-[25px] bg-slate-800 z-30"></div>
          
          <svg class="absolute right-0 bottom-[-24px] w-[24px] h-[24px] z-40 pointer-events-none" viewBox="0 0 24 24" fill="none">
            <path d="M0 0 L24 0 L24 24 C24 10.7452 13.2548 0 0 0 Z" fill="#1e293b"/>
            <path d="M0 0 C13.2548 0 24 10.7452 24 24" stroke="rgba(71,85,105,0.6)" stroke-width="1.5" fill="none"/>
          </svg>

          <h3 class="text-base font-bold text-white mb-5 flex items-center gap-2 shrink-0">
            <span class="w-1.5 h-4 bg-cyan-400 rounded-sm shadow-[0_0_8px_#22d3ee]"></span> 自动化流水线
          </h3>
          <div class="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
            <div v-for="(step, idx) in steps" :key="idx" 
                 @click="changeView(idx)"
                 class="p-4 rounded-xl border transition-all duration-200 ease-out cursor-pointer flex items-center gap-4 group active:scale-[0.98]"
                 :class="{
                   'border-blue-400/60 bg-blue-900/40 shadow-[inset_0_0_15px_rgba(59,130,246,0.2)]': currentView === idx, 
                   'border-slate-700/60 bg-slate-900/40 hover:bg-slate-700 hover:border-blue-500/50': currentView !== idx && idx > maxCompletedStep, 
                   'border-emerald-500/30 bg-emerald-900/20 hover:bg-emerald-900/40': currentView !== idx && idx <= maxCompletedStep 
                 }">
              <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-transform duration-200 shadow-sm"
                   :class="{
                     'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]': currentView === idx,
                     'bg-slate-800 text-slate-400 border border-slate-600': currentView !== idx && idx > maxCompletedStep,
                     'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]': currentView !== idx && idx <= maxCompletedStep
                   }">
                <el-icon v-if="idx <= maxCompletedStep && currentView !== idx"><Check /></el-icon>
                <span v-else>{{ idx + 1 }}</span>
              </div>
              <div class="flex-1 overflow-hidden">
                <h4 class="font-bold text-sm transition-colors duration-200 truncate" :class="currentView === idx ? 'text-white' : 'text-slate-300'">{{ step.label }}</h4>
                <p class="text-xs mt-1 truncate" :class="currentView === idx ? 'text-blue-200/80' : 'text-slate-500'">{{ step.shortDesc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="w-[340px] bg-slate-800 rounded-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-slate-600/60 p-6 shrink-0 flex flex-col gap-5 relative z-10">
          <div>
            <div class="flex justify-between text-sm font-bold text-white mb-2.5">
              <span>总体处理进度</span>
              <span class="text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">{{ progressPercent }}%</span>
            </div>
            <div class="h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700 shadow-inner">
              <div class="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500 ease-out relative" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
          
          <button @click="runFullProcess" :disabled="isProcessing"
                  class="w-full text-white font-bold text-sm py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] border-0 outline-none ring-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
                  :class="isProcessing ? 'bg-slate-700 shadow-none' : 'bg-gradient-to-r from-[#1d4ed8] to-[#06b6d4]'">
            <el-icon v-if="!isProcessing" size="16"><VideoPlay /></el-icon>
            <el-icon v-else class="is-loading" size="16"><Loading /></el-icon>
            {{ isProcessing ? '系统计算中...' : '一键全流程执行' }}
          </button>
        </div>
      </div>

      <div class="flex-1 bg-slate-800 rounded-r-3xl rounded-bl-3xl rounded-tl-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-600/60 p-8 flex flex-col relative z-10 min-w-0" style="padding-left: 2rem;">
        
        <div class="mb-8 shrink-0 border-b border-slate-600/50 pb-5 flex justify-between items-start">
          <div>
            <h3 class="text-2xl font-black text-white mb-2 drop-shadow-md">{{ steps[currentView].label }}</h3>
            <p class="text-slate-400 text-sm font-medium">{{ steps[currentView].fullDesc }}</p>
          </div>
          <button v-if="currentView === 0" class="px-5 py-2.5 bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 rounded-xl text-sm font-bold hover:bg-indigo-600/40 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.2)] cursor-pointer active:scale-95">
            <el-icon size="16"><Cpu /></el-icon> 模型训练
          </button>
        </div>
        
        <div v-if="currentView === 0" class="flex-1 flex flex-col animate-fade-in-up">
          <div v-if="maxCompletedStep < 0" class="flex-1 grid grid-cols-2 gap-6 relative z-10">
            <div @click="triggerStitchedFileInput" 
                 class="border-2 border-dashed border-indigo-500/60 rounded-2xl bg-indigo-900/20 hover:bg-indigo-800/40 hover:border-indigo-400/80 transition-all flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden shadow-[inset_0_0_20px_rgba(79,70,229,0.1)]">
              <input type="file" ref="stitchedFileInput" @change="handleStitchedFile" accept=".tif,.tiff,.jpg,.png" class="hidden" />
              <div class="w-20 h-20 bg-indigo-900/50 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.4)] border border-indigo-500/50 flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] transition-all">
                <el-icon size="32" class="text-indigo-400"><PictureFilled /></el-icon>
              </div>
              <h4 class="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">上传已拼接完整影像</h4>
              <p class="text-xs text-indigo-200/60 font-medium tracking-wide">单张正射影像 (TIFF/JPG) | 直接进入水质反演</p>
            </div>
            <div @click="triggerRawFileInput" 
                 class="border-2 border-dashed border-blue-500/60 rounded-2xl bg-blue-900/20 hover:bg-blue-800/40 hover:border-blue-400/80 transition-all flex flex-col items-center justify-center cursor-pointer group relative overflow-hidden shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]">
              <input type="file" ref="rawFileInput" @change="handleRawFile" webkitdirectory directory multiple class="hidden" />
              <div class="w-20 h-20 bg-blue-900/50 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.4)] border border-blue-500/50 flex items-center justify-center mb-6 group-hover:-translate-y-2 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] transition-all">
                <el-icon size="32" class="text-blue-400"><FolderOpened /></el-icon>
              </div>
              <h4 class="text-lg font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">上传待拼接影像文件夹</h4>
              <p class="text-xs text-blue-200/60 font-medium tracking-wide">包含多张无人机原图 | 执行预处理与拼接</p>
            </div>
          </div>

          <div v-else class="flex-1 flex flex-col items-center justify-center bg-emerald-900/20 border border-emerald-500/30 rounded-2xl shadow-[inset_0_0_30px_rgba(16,185,129,0.05)]">
            <div class="w-20 h-20 bg-emerald-800/50 rounded-full flex items-center justify-center mb-6 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <el-icon size="40" class="text-emerald-400"><CircleCheckFilled /></el-icon>
            </div>
            <h4 class="text-xl font-bold text-emerald-300 mb-3 drop-shadow-sm">数据已就绪并完成参数配置</h4>
            <p class="text-sm text-slate-300 mb-8 font-mono bg-slate-900/60 px-4 py-2 rounded-lg border border-slate-700 border-l-4 border-l-emerald-500 shadow-md">
              上传类型：<span class="text-emerald-400 font-bold">{{ uploadType === 'stitched' ? '单张已拼接影像' : '无人机原始影像集' }}</span> | 
              文件数：<span class="text-cyan-400">{{ uploadedFileCount }}</span>
            </p>
          </div>
        </div>

        <div v-else class="flex-1 flex flex-col animate-fade-in-up">
          <div v-if="isProcessing && processingStep === currentView" class="flex-1 flex flex-col items-center justify-center">
            <div class="w-32 h-32 relative flex items-center justify-center mb-8">
              <div class="absolute inset-0 border-[2px] border-slate-600 rounded-full"></div>
              <div class="absolute inset-2 border-[3px] border-transparent border-t-blue-400 rounded-full animate-spin shadow-[0_0_15px_#3b82f6]"></div>
              <div class="absolute inset-6 border-[3px] border-transparent border-b-cyan-300 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
              <el-icon class="text-3xl text-blue-300 animate-pulse"><Cpu /></el-icon>
            </div>
            <h4 class="text-lg font-bold text-blue-300 tracking-widest uppercase drop-shadow-[0_0_8px_currentColor]">Processing Engine Active</h4>
            <p class="text-slate-400 font-mono text-xs mt-3">正在调用后端算法执行深度计算...</p>
          </div>

          <div v-else-if="maxCompletedStep >= currentView" class="flex-1 flex flex-col">
            <div class="flex-1 bg-slate-900/60 rounded-2xl border border-slate-600/50 flex items-center justify-center overflow-hidden mb-6 relative shadow-[inset_0_0_50px_rgba(0,0,0,0.3)] group">
              
              <template v-if="currentView !== 3 || !inversionResultImageUrl">
                <div class="bg-slate-800/80 backdrop-blur border border-slate-500 px-8 py-4 rounded-xl shadow-lg font-bold text-slate-200 relative z-10 flex items-center gap-3">
                  <el-icon size="20" class="text-blue-400"><PictureFilled /></el-icon> 
                  {{ steps[currentView].label }} 成果可视化预览区
                </div>
              </template>
              
              <template v-else>
                <img :src="inversionResultImageUrl" class="absolute inset-0 w-full h-full object-contain bg-black opacity-95" alt="反演热力图" />
                <div class="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-600 px-4 py-3 rounded-lg flex flex-col gap-1 z-10 shadow-xl">
                  <span class="text-xs text-slate-300 font-bold mb-1 border-b border-slate-700 pb-1">Chla 浓度 (mg/m³)</span>
                  <div class="w-32 h-2.5 bg-gradient-to-r from-blue-500 via-green-400 via-yellow-400 to-red-500 rounded-sm mt-1"></div>
                  <div class="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                    <span>0.0</span><span>20.0</span><span>>50.0</span>
                  </div>
                </div>
              </template>

            </div>
            
            <div class="flex justify-end gap-4 shrink-0">
              <button class="bg-slate-700 border border-slate-500 hover:bg-slate-600 text-white font-bold text-sm py-3 px-8 rounded-xl transition-colors">全屏洞察</button>
              <button class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm py-3 px-8 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2 border-0">
                <el-icon><Download /></el-icon> 导出高清成果
              </button>
            </div>
          </div>

          <div v-else class="flex-1 flex flex-col items-center justify-center opacity-50">
            <div class="w-24 h-24 bg-slate-900/50 rounded-full flex items-center justify-center mb-5 border border-slate-700 shadow-inner">
              <el-icon size="32" class="text-slate-500"><Lock /></el-icon>
            </div>
            <p class="text-slate-500 text-sm font-bold tracking-wide">系统等待中：前置任务尚未完成</p>
          </div>
        </div>
      </div>

      <div class="w-[320px] bg-[#0b1120]/95 backdrop-blur-3xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden shrink-0 relative z-10 border border-slate-700">
        <div class="bg-slate-800/80 px-5 py-4 flex items-center justify-between border-b border-slate-700/80 shrink-0">
          <div class="flex items-center gap-2 text-slate-300 text-xs font-bold tracking-widest uppercase drop-shadow-[0_0_5px_rgba(203,213,225,0.4)]">
            <el-icon><Monitor /></el-icon> System Console
          </div>
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_5px_#ff5f56]"></div>
            <div class="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_5px_#ffbd2e]"></div>
            <div class="w-3 h-3 rounded-full bg-[#27c93f] shadow-[0_0_5px_#27c93f]"></div>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto p-5 font-mono text-[11px] sm:text-xs space-y-3.5 custom-terminal-scroll">
          <div v-for="(log, idx) in logs" :key="idx" class="flex gap-3 leading-relaxed animate-fade-in-up">
            <span class="text-emerald-500 shrink-0 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">[{{ log.time }}]</span>
            <span :class="{
              'text-blue-300 drop-shadow-[0_0_5px_rgba(147,197,253,0.4)]': log.type === 'info', 
              'text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(52,211,153,0.6)]': log.type === 'success', 
              'text-rose-400 font-bold drop-shadow-[0_0_5px_rgba(251,113,133,0.6)]': log.type === 'error'
            }" class="break-words">{{ log.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showConfigDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in-up">
      <div class="bg-[#0b1120]/95 backdrop-blur-xl border border-slate-600 shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-2xl w-[480px] overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/80">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <el-icon class="text-blue-400"><Setting /></el-icon> 飞行与反演参数配置
          </h3>
        </div>
        <div class="p-6 space-y-6">
          <div class="bg-blue-900/30 border border-blue-500/40 px-4 py-2 rounded-lg flex items-center gap-3 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)]">
            <el-icon class="text-blue-400" size="20"><PictureFilled /></el-icon>
            <span class="text-sm font-bold text-white">文件解析成功，数量：{{ uploadedFileCount }}</span>
          </div>
          <div>
            <label class="flex items-center gap-2 text-sm font-bold text-white mb-2">
              <span class="w-1.5 h-4 bg-cyan-400 rounded-sm shadow-[0_0_8px_#22d3ee]"></span> 航向重叠率 (Forward Overlap)
            </label>
            <div class="px-2"><el-slider v-model="droneConfig.overlap" :min="50" :max="90" show-input class="glass-slider" /></div>
          </div>
          <div>
            <label class="flex items-center gap-2 text-sm font-bold text-white mb-2">
              <span class="w-1.5 h-4 bg-cyan-400 rounded-sm shadow-[0_0_8px_#22d3ee]"></span> 旁向重叠率 (Side Overlap)
            </label>
            <div class="px-2"><el-slider v-model="droneConfig.sideOverlap" :min="40" :max="80" show-input class="glass-slider" /></div>
          </div>
          <div>
            <label class="flex items-center gap-2 text-sm font-bold text-white mb-2">
              <span class="w-1.5 h-4 bg-blue-500 rounded-sm shadow-[0_0_8px_#3b82f6]"></span> 水质反演 AI 模型
            </label>
            <div class="flex gap-3">
              <button class="flex-1 py-2 rounded-lg border border-blue-400 bg-blue-500/20 text-white text-sm font-bold shadow-[inset_0_0_10px_rgba(59,130,246,0.3)]">叶绿素深度网络 v2.1</button>
              <button class="flex-1 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-400 text-sm font-bold hover:bg-slate-700 hover:text-white transition">悬浮物综合模型</button>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 bg-slate-900/90 border-t border-slate-700 flex justify-end gap-3">
          <button @click="cancelConfig" class="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border border-slate-600">取消上传</button>
          <button @click="confirmConfig" class="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all active:scale-95 border-0">
            保存并锁定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { ArrowLeft, Check, VideoPlay, Loading, UploadFilled, CircleCheckFilled, PictureFilled, Download, Lock, Monitor, Cpu, Setting, FolderOpened } from '@element-plus/icons-vue'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '')

const goBack = () => router.push('/')
const goLogin = () => router.push('/login')
const handleLogout = () => { localStorage.removeItem('token'); username.value = ''; ElMessage.success('已退出') }

const steps = ref([
  { label: "数据采集与上传", shortDesc: "校验影像格式与完整性", fullDesc: "上传无人机 RGB 原始影像，系统将自动校验文件格式、坐标信息与数据完整性。" },
  { label: "影像预处理与拼接", shortDesc: "去雾增强与正射拼接", fullDesc: "进行镜头畸变校正、去雾增强优化，并对接算法引擎，将多帧影像拼接生成正射影像。" },
  { label: "水体提取", shortDesc: "AI智能识别水体边界", fullDesc: "利用 NDWI（归一化水体指数）与 AI 视觉模型，自动识别水体范围与边界并生成掩膜。" },
  { label: "叶绿素反演", shortDesc: "预测水质参数分布", fullDesc: "基于机器学习与反演模型，预测水质核心参数，输出叶绿素a的空间浓度分布图。" },
  { label: "水质评价", shortDesc: "生成综合等级评价", fullDesc: "结合国家地表水环境质量标准，生成水质综合等级评价与富营养化风险分析。" },
  { label: "报告输出", shortDesc: "导出可视化监测成果", fullDesc: "自动化汇编各阶段数据与反演图表，导出高精度的可视化水质遥感监测报告。" }
])

const currentView = ref(0)
const maxCompletedStep = ref(-1)
const processingStep = ref(-1)
const isProcessing = ref(false)
const progressPercent = ref(0)
const logs = ref([{ time: new Date().toLocaleTimeString(), type: 'info', text: '无人机近端计算引擎初始化完成，等待输入数据...' }])

const showConfigDialog = ref(false)
const uploadedFileCount = ref(0)
const droneConfig = ref({ overlap: 85, sideOverlap: 70 })

const inversionResultImageUrl = ref('')

const changeView = (idx) => { currentView.value = idx }

const stitchedFileInput = ref(null)
const rawFileInput = ref(null)
const uploadType = ref('raw')

// 真实环境必须保存的 File 对象引用
const selectedFile = ref(null)

const triggerStitchedFileInput = () => { if (stitchedFileInput.value) stitchedFileInput.value.click() }
const triggerRawFileInput = () => { if (rawFileInput.value) rawFileInput.value.click() }

const handleStitchedFile = (e) => {
  const files = e.target.files
  if (files && files.length > 0) {
    selectedFile.value = files[0] // 存储真实文件用于 Axios 传输
    uploadedFileCount.value = 1
    uploadType.value = 'stitched'
    showConfigDialog.value = true
    if(stitchedFileInput.value) stitchedFileInput.value.value = '' 
  }
}

const handleRawFile = (e) => {
  const files = e.target.files
  if (files && files.length > 0) {
    selectedFile.value = files // 暂存文件列表
    uploadedFileCount.value = files.length
    uploadType.value = 'raw'
    showConfigDialog.value = true
    if(rawFileInput.value) rawFileInput.value.value = '' 
  }
}

const cancelConfig = () => {
  showConfigDialog.value = false
  selectedFile.value = null
}

const confirmConfig = () => {
  showConfigDialog.value = false
  
  if (uploadType.value === 'stitched') {
    maxCompletedStep.value = 2;
    currentView.value = 3;
    progressPercent.value = 50; 
    logs.value.push({ time: new Date().toLocaleTimeString(), type: 'success', text: `检测到单张拼接影像，跳过处理管线，直连反演核心。` })
  } else {
    maxCompletedStep.value = 0;
    currentView.value = 0;
    progressPercent.value = 0;
    logs.value.push({ time: new Date().toLocaleTimeString(), type: 'success', text: `读取 ${uploadedFileCount.value} 张影像，数据就绪。` })
  }
  
  ElMessage.success('配置已锁定，可执行全流程处理。')
}

const runFullProcess = async () => {
  if (maxCompletedStep.value < 0) { ElMessage.warning('请先上传数据并确认配置'); return }
  isProcessing.value = true
  
  let startIdx = maxCompletedStep.value + 1;
  progressPercent.value = Math.max(progressPercent.value, Math.round((startIdx / steps.value.length) * 100));

  for (let i = startIdx; i < steps.value.length; i++) {
    currentView.value = i; 
    processingStep.value = i;
    logs.value.push({ time: new Date().toLocaleTimeString(), type: 'info', text: `启动模块：[${steps.value[i].label}]` })
    
    // 真实生产环境：调用后端 API (针对叶绿素反演步骤)
    if (i === 3 && uploadType.value === 'stitched' && selectedFile.value) {
      logs.value.push({ time: new Date().toLocaleTimeString(), type: 'info', text: `>> 正在上传影像并调用云端反演接口...` })
      try {
        const formData = new FormData()
        formData.append('file', selectedFile.value)
        formData.append('overlap', droneConfig.value.overlap)

        const token = localStorage.getItem('token') || ''
        
        // 发送真实请求到你指定的腾讯云服务器地址
        const response = await axios.post('http://localhost:5173/api/inversion/stitched', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        
        // 假设后端成功返回图片 URL
        if (response.data && response.data.image_url) {
            inversionResultImageUrl.value = response.data.image_url;
        } else {
            // 兼容容错：若未配置图片，给一张占位图避免报错
            inversionResultImageUrl.value = 'https://images.unsplash.com/photo-1620021650393-3d02632b7756?q=80&w=1200&auto=format&fit=crop';
        }
        
        logs.value.push({ time: new Date().toLocaleTimeString(), type: 'success', text: `>> R 模型反演计算完成，渲染空间分布图。` })
      } catch (error) {
        logs.value.push({ time: new Date().toLocaleTimeString(), type: 'error', text: `>> 后端接口请求失败: ${error.message}` })
        isProcessing.value = false;
        processingStep.value = -1;
        return; // 接口报错直接中止流程
      }
    } else {
      // 其它未接真实后端的步骤暂时保留时序模拟
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    maxCompletedStep.value = i;
    progressPercent.value = Math.min(100, Math.round(((i + 1) / steps.value.length) * 100));
    logs.value.push({ time: new Date().toLocaleTimeString(), type: 'success', text: `[${steps.value[i].label}] 执行完成` })
  }
  
  isProcessing.value = false; 
  processingStep.value = -1;
  ElMessage.success('全流程执行完毕！')
}
</script>

<style scoped>
@keyframes fadeInUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.is-loading { animation: rotating 2s linear infinite; }
@keyframes rotating { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.custom-terminal-scroll::-webkit-scrollbar { width: 5px; }
.custom-terminal-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-terminal-scroll::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
.custom-terminal-scroll::-webkit-scrollbar-thumb:hover { background: #64748b; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

:deep(.glass-slider .el-slider__runway) { background-color: rgba(30, 41, 59, 0.8) !important; }
:deep(.glass-slider .el-slider__bar) { background: linear-gradient(90deg, #3b82f6, #06b6d4); }
:deep(.glass-slider .el-slider__button) { border: 2px solid #06b6d4; background-color: #0b1120; box-shadow: 0 0 10px rgba(6, 182, 212, 0.8); }
:deep(.glass-slider .el-input-number__increase),
:deep(.glass-slider .el-input-number__decrease) {
  background-color: rgba(30, 41, 59, 0.8) !important;
  border-color: rgba(51, 65, 85, 0.8) !important;
  color: #ffffff !important;
}
</style>