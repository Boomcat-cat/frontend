<template>
  <div class="h-screen w-screen relative flex flex-col font-sans text-slate-50 overflow-hidden bg-slate-800">
    
    <div class="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-cyan-400/15 blur-[150px] rounded-full pointer-events-none z-0"></div>

    <nav class="h-16 flex items-center justify-between px-6 bg-slate-800/80 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] border-b border-slate-500/50 z-30 shrink-0">
      <button @click="goBack" class="flex items-center gap-2 text-sm text-slate-300 hover:text-white font-bold transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-600/80">
        <el-icon><ArrowLeft /></el-icon> 返回首页
      </button>
      <h2 class="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 tracking-widest drop-shadow-md">
        卫星遥感广域水质分析引擎
      </h2>
      <div class="flex items-center gap-4">
        <span v-if="username" class="text-sm font-bold text-slate-300">操作员：{{ username }}</span>
        <button v-if="username" @click="handleLogout" class="text-sm text-rose-400 hover:text-rose-300 font-bold px-3 py-1.5 rounded-md hover:bg-rose-500/10 transition-colors">退出</button>
        <button v-else @click="goLogin" class="text-sm text-blue-400 hover:text-blue-300 font-bold hover:bg-blue-600/10 px-4 py-1.5 rounded-md transition-colors">系统登录</button>
      </div>
    </nav>

    <div class="flex-1 flex gap-6 p-6 w-full max-w-[1600px] mx-auto min-h-0 relative z-10">
      
      <div class="flex-[2] relative rounded-3xl overflow-hidden bg-slate-900 shadow-[0_0_40px_rgba(6,182,212,0.25)] border-2 border-slate-600 transition-shadow duration-500 hover:shadow-[0_0_60px_rgba(6,182,212,0.4)]">
        <div id="map" class="w-full h-full filter brightness-[1.1] contrast-[1.05] saturate-[1.1]"></div>
        
        <div class="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-700/80 backdrop-blur-xl border border-slate-500/50 p-2.5 rounded-2xl shadow-xl flex flex-col gap-3 z-20">
          <el-tooltip content="矩形框选" placement="left" :hide-after="0">
            <button @click="setDrawType('Rectangle')" class="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm" :class="drawType === 'Rectangle' ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-slate-600/80 text-slate-300 hover:bg-slate-500 hover:text-blue-400'"><el-icon size="18"><Select /></el-icon></button>
          </el-tooltip>
          <el-tooltip content="多边形精确绘制" placement="left" :hide-after="0">
            <button @click="setDrawType('Polygon')" class="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm" :class="drawType === 'Polygon' ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'bg-slate-600/80 text-slate-300 hover:bg-slate-500 hover:text-blue-400'"><el-icon size="18"><Edit /></el-icon></button>
          </el-tooltip>
          <div class="w-6 h-px bg-slate-500/80 mx-auto my-1"></div>
          <el-tooltip :content="modifyActive ? '完成修改' : '节点微调'" placement="left" :hide-after="0">
            <button @click="toggleModify" class="w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm" :class="modifyActive ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'bg-slate-600/80 text-slate-300 hover:bg-slate-700 hover:text-yellow-400'"><el-icon size="18"><Operation /></el-icon></button>
          </el-tooltip>
          <el-tooltip content="清空区域" placement="left" :hide-after="0">
            <button @click="clearDraw" class="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-rose-400 transition-all shadow-sm"><el-icon size="18"><Delete /></el-icon></button>
          </el-tooltip>
        </div>
        
        <div v-if="drawType !== 'None'" class="absolute top-6 left-1/2 -translate-x-1/2 bg-blue-600/95 backdrop-blur-md border border-blue-400/50 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_0_25px_rgba(59,130,246,0.6)] animate-fade-in pointer-events-none">
          正在绘制目标区域，绘制完成后将自动锁定...
        </div>
      </div>

      <div class="w-[420px] flex flex-col shrink-0">
        <div class="bg-[#0b1120]/80 backdrop-blur-2xl rounded-3xl shadow-xl border border-slate-700/80 p-7 flex flex-col flex-1 min-h-0 relative overflow-hidden">
          
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[50px] rounded-full pointer-events-none"></div>

          <div class="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/80 relative z-10">
            <div class="w-10 h-10 rounded-xl bg-slate-800/80 flex items-center justify-center text-blue-400 shadow-inner border border-slate-600">
              <el-icon size="20"><Setting /></el-icon>
            </div>
            <h3 class="text-xl font-black text-white drop-shadow-sm">云端引擎配置 <span class="text-xs text-blue-500 ml-2 uppercase font-mono tracking-widest font-bold">Setup</span></h3>
          </div>

          <el-form :model="form" label-position="top" class="flex-1 overflow-y-auto no-scrollbar px-3 -mx-3 relative z-10 custom-glass-form">
            
            <el-form-item>
              <template #label>
                <span class="font-bold text-white flex items-center gap-2">
                  <span class="w-1.5 h-4 bg-blue-500 rounded-sm shadow-[0_0_10px_#3b82f6] ml-1"></span> 
                  <el-icon class="text-blue-400"><Location /></el-icon> 目标区域坐标锁定 <span class="text-[10px] text-slate-500 uppercase tracking-wider ml-1">AOI Target</span>
                </span>
              </template>
              <el-input v-model="form.area" placeholder="请在左侧地图框选或绘制目标区域" readonly :rows="2" type="textarea" class="glass-input" />
            </el-form-item>
            
            <el-form-item>
              <template #label>
                <span class="font-bold text-white flex items-center gap-2 mt-2">
                  <span class="w-1.5 h-4 bg-cyan-400 rounded-sm shadow-[0_0_10px_#22d3ee] ml-1"></span> 
                  <el-icon class="text-cyan-400"><PartlyCloudy /></el-icon> 影像云量剔除上限 <span class="text-[10px] text-slate-500 uppercase tracking-wider ml-1">Cloud Cover</span>
                </span>
              </template>
              <div class="px-2 w-full"><el-slider v-model="form.cloud_cover" :min="0" :max="100" show-input class="glass-slider-blue" /></div>
            </el-form-item>
            
            <el-form-item>
              <template #label>
                <span class="font-bold text-white flex items-center gap-2 mt-2">
                  <span class="w-1.5 h-4 bg-indigo-400 rounded-sm shadow-[0_0_10px_#818cf8] ml-1"></span> 
                  <el-icon class="text-indigo-400"><Calendar /></el-icon> 遥感时序追溯范围 <span class="text-[10px] text-slate-500 uppercase tracking-wider ml-1">Time Series</span>
                </span>
              </template>
              <el-date-picker v-model="form.date_range" type="daterange" range-separator="至" start-placeholder="起始日期" end-placeholder="截止日期" style="width: 100%" class="glass-datepicker" />
            </el-form-item>
            
            <el-form-item>
              <template #label>
                <span class="font-bold text-white flex items-center gap-2 mt-2">
                  <span class="w-1.5 h-4 bg-blue-500 rounded-sm shadow-[0_0_10px_#3b82f6] ml-1"></span> 
                  <el-icon class="text-blue-400"><Cpu /></el-icon> 自动化反演管线 <span class="text-[10px] text-slate-500 uppercase tracking-wider ml-1">AI Pipeline</span>
                </span>
              </template>
              <div class="flex flex-col gap-3 mt-1 w-full">
                <label v-for="option in ['水体边界高精度提取 (NDWI)', '水质 FUI 指数计算与分级', '重点污染区叶绿素/浊度自动反演']" :key="option"
                       class="relative flex items-center p-3.5 rounded-xl cursor-pointer transition-all duration-150 ease-out border active:scale-[0.98] group"
                       :class="form.products.includes(option) ? 'bg-blue-900/40 border-blue-400/60 shadow-[inset_0_0_15px_rgba(59,130,246,0.15)]' : 'bg-slate-700/60 border-slate-600/60 hover:bg-slate-600 hover:border-blue-500/50'">
                  <div class="w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-150 mr-3 shrink-0"
                       :class="form.products.includes(option) ? 'bg-blue-500 border-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-slate-600 border-slate-500 group-hover:border-blue-400'">
                    <el-icon v-if="form.products.includes(option)" color="white" size="14"><Check /></el-icon>
                  </div>
                  <span class="text-sm font-bold transition-colors duration-150" :class="form.products.includes(option) ? 'text-white' : 'text-slate-300 group-hover:text-white'">{{ option }}</span>
                  <input type="checkbox" :value="option" v-model="form.products" class="hidden" />
                </label>
              </div>
            </el-form-item>
          </el-form>

          <div class="pt-6 mt-2 relative z-10 border-t border-slate-500/50">
            <button @click="startProcessing"
                    class="w-full text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] border-0 outline-none ring-0 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] focus:outline-none cursor-pointer bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-500 hover:to-cyan-500">
              <el-icon size="18"><VideoPlay /></el-icon> 锁定目标区域，提交云端超算
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { fromLonLat, toLonLat } from 'ol/proj'
import { Draw, Modify, Snap } from 'ol/interaction'
import { createBox } from 'ol/interaction/Draw'
import { Vector } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Style, Fill, Stroke } from 'ol/style'
import { ArrowLeft, Setting, Select, Edit, Operation, Delete, VideoPlay, Check, Location, Calendar, PartlyCloudy, Cpu, FolderOpened } from '@element-plus/icons-vue'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '')
const map = ref(null)
const drawType = ref('None')
const modifyActive = ref(false)
let drawInteraction = ref(null)
let modifyInteraction = ref(null)
const drawSource = ref(new VectorSource())

const form = ref({
  area: '', cloud_cover: 15, date_range: [],
  products: ['水体边界高精度提取 (NDWI)', '水质 FUI 指数计算与分级', '重点污染区叶绿素/浊度自动反演']
})

const goBack = () => router.push('/')
const goLogin = () => router.push('/login')
const handleLogout = () => { localStorage.removeItem('token'); username.value = ''; ElMessage.success('已退出') }

const startProcessing = async () => {
  if (!form.value.area) { ElMessage.warning('系统警告：请先在左侧地图中框选需要监测的水域范围！'); return }
  const token = localStorage.getItem('token')
  if (!token) { ElMessage.warning('请先登录系统！'); router.push('/login'); return }

  try {
    const payload = {
      ...form.value,
      date_range: form.value.date_range && form.value.date_range.length ? form.value.date_range.join(' ~ ') : '不限'
    }
    await axios.post('http://localhost:8000/satellite/submit', payload, { headers: { Authorization: `Bearer ${token}` } })
    ElMessage.success({ message: '🛰️ 云端监测引擎已启动，可前往个人页面查看进度！', duration: 3000 })
    router.push('/user-center') 
  } catch (err) {
    ElMessage.error(err.response?.data?.detail || '任务提交失败，请检查网络')
  }
}

const setDrawType = (type) => { drawType.value = drawType.value === type ? 'None' : type; updateDrawInteraction() }

const updateDrawInteraction = () => {
  if (drawInteraction.value) { map.value.removeInteraction(drawInteraction.value); drawInteraction.value = null }
  if (drawType.value === 'None') return

  let geometryFunction = undefined; let type = drawType.value
  if (drawType.value === 'Rectangle') { type = 'Circle'; geometryFunction = createBox() }

  drawInteraction.value = new Draw({ source: drawSource.value, type: type, geometryFunction: geometryFunction, stopClick: true })
  map.value.addInteraction(drawInteraction.value)

  drawInteraction.value.on('drawend', (e) => {
    drawSource.value.clear(); drawSource.value.addFeature(e.feature)
    const coordinates = e.feature.getGeometry().getExtent()
    const bl = toLonLat([coordinates[0], coordinates[1]])
    const tr = toLonLat([coordinates[2], coordinates[3]])
    form.value.area = `南西角: [${bl[0].toFixed(4)}, ${bl[1].toFixed(4)}]\n北东角: [${tr[0].toFixed(4)}, ${tr[1].toFixed(4)}]`
    ElMessage.success('目标区域坐标抓取成功！')
    drawType.value = 'None'; updateDrawInteraction()
  })
}

const toggleModify = () => {
  modifyActive.value = !modifyActive.value
  if (modifyActive.value) { modifyInteraction.value = new Modify({ source: drawSource.value }); map.value.addInteraction(modifyInteraction.value) } 
  else if (modifyInteraction.value) { map.value.removeInteraction(modifyInteraction.value) }
}

const clearDraw = () => { drawSource.value.clear(); form.value.area = ''; modifyActive.value = false; }

const initMap = () => {
  const tiandituSatellite = new TileLayer({ source: new XYZ({ url: 'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=efa58a46b9929b0b10cf08d58ab86f07', projection: 'EPSG:3857' }) })
  const drawLayer = new Vector({
    source: drawSource.value,
    style: new Style({
      fill: new Fill({ color: 'rgba(59, 130, 246, 0.2)' }), 
      stroke: new Stroke({ color: '#3b82f6', width: 2, lineDash: [5, 5] })
    })
  })
  map.value = new Map({ target: 'map', layers: [tiandituSatellite, drawLayer], view: new View({ center: fromLonLat([118.1, 24.5]), zoom: 11, minZoom: 4, maxZoom: 18 }) })
}
onMounted(() => initMap())
</script>

<style scoped>
:deep(.ol-zoom), :deep(.ol-attribution) { display: none; }

:deep(.custom-glass-form .el-textarea__inner),
:deep(.custom-glass-form .el-input__wrapper) {
  background-color: rgba(71, 85, 105, 0.6) !important; 
  backdrop-filter: blur(8px);
  border-radius: 12px;
  box-shadow: 0 0 0 1px rgba(148, 163, 184, 0.5) inset !important; 
  color: #f8fafc !important; 
  font-weight: 500;
  transition: all 0.2s;
}

:deep(.custom-glass-form .el-input__inner::placeholder),
:deep(.custom-glass-form .el-textarea__inner::placeholder) {
  color: #CBD5E1 !important; 
}

:deep(.custom-glass-form .el-textarea__inner:focus),
:deep(.custom-glass-form .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px #3b82f6 inset, 0 4px 15px rgba(59, 130, 246, 0.3) !important; 
  background-color: rgba(51, 65, 85, 0.8) !important; 
}

:deep(.custom-glass-form .glass-input) {
  font-family: 'Consolas', monospace;
  font-size: 13px;
  resize: none !important; 
}

:deep(.el-range-input) { color: #f8fafc !important; }

:deep(.glass-slider-blue .el-slider__runway) { background-color: rgba(71, 85, 105, 0.6) !important; }
:deep(.glass-slider-blue .el-slider__bar) { background: linear-gradient(90deg, #3b82f6, #06b6d4); }
:deep(.glass-slider-blue .el-slider__button) { border: 2px solid #06b6d4; background-color: #1e293b; box-shadow: 0 0 10px rgba(6, 182, 212, 0.6); }

:deep(.el-input-number__increase),
:deep(.el-input-number__decrease) {
  background-color: rgba(71, 85, 105, 0.8) !important;
  border-color: rgba(148, 163, 184, 0.5) !important;
  color: #f8fafc !important;
}
</style>