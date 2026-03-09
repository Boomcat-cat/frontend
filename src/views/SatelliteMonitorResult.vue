<template>
  <div class="h-screen w-screen bg-slate-800 flex flex-col font-sans text-slate-200 overflow-hidden relative animate-fade-in-slow">
    
    <nav class="h-14 flex items-center justify-between px-6 bg-slate-800/80 backdrop-blur-xl border-b border-slate-700/50 z-30 shrink-0">
      <button @click="router.push('/user-center')" class="flex items-center gap-2 text-sm text-slate-400 hover:text-white font-bold transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-700/50">
        <el-icon><ArrowLeft /></el-icon> 返回任务中心
      </button>
      <div class="flex items-center gap-3 bg-emerald-900/30 px-4 py-1.5 rounded-full border border-emerald-500/30">
        <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></div>
        <h2 class="text-sm font-bold tracking-widest text-emerald-400 uppercase">Task {{ route.query.taskId || 'Completed' }} / Satellite Engine</h2>
      </div>
      <div class="w-24"></div> 
    </nav>

    <div class="flex-1 relative overflow-hidden">
      <div id="result-map" class="w-full h-full filter brightness-[0.9] contrast-[1.05] saturate-[0.8]"></div>

      <div class="absolute bottom-8 left-8 bg-slate-900/85 backdrop-blur-xl border border-slate-700/50 p-5 rounded-2xl shadow-2xl z-20 w-72 animate-fade-in-up">
        <h4 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <span class="w-1 h-3 bg-emerald-500 rounded-full"></span> FUI 水色指数图例
        </h4>
        <div class="space-y-3 text-xs font-medium text-slate-300">
          <div class="flex items-center justify-between"><div class="flex items-center gap-3"><span class="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></span> 1-5 贫营养</div> <span class="text-slate-400">优</span></div>
          <div class="flex items-center justify-between"><div class="flex items-center gap-3"><span class="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span> 6-9 中营养</div> <span class="text-slate-400">良</span></div>
          <div class="flex items-center justify-between"><div class="flex items-center gap-3"><span class="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></span> 10-15 富营养</div> <span class="text-slate-400">轻度污染</span></div>
          <div class="flex items-center justify-between"><div class="flex items-center gap-3"><span class="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_#f43f5e] animate-pulse"></span> >16 极度富营养</div> <span class="text-rose-400 font-bold">黑臭预警</span></div>
        </div>
      </div>

      <Transition name="slide-panel">
        <div v-if="selectedWaterBody" class="absolute top-6 right-6 bottom-6 w-[440px] bg-slate-800/90 backdrop-blur-2xl rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.4)] z-30 flex flex-col overflow-hidden border border-slate-600/50 text-slate-200">
          
          <div class="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] pointer-events-none" :class="selectedWaterBody.fui >= 10 ? 'bg-rose-600/30' : 'bg-emerald-500/20'"></div>

          <div class="px-6 py-5 border-b border-slate-700/50 flex justify-between items-start shrink-0 relative z-10">
            <div>
              <div class="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-mono">Water Body ID</div>
              <h3 class="text-2xl font-black text-white drop-shadow-md">{{ selectedWaterBody.id }}</h3>
              <p class="text-[11px] text-emerald-300/80 mt-1.5 font-mono bg-emerald-500/10 inline-block px-2 py-0.5 rounded border border-emerald-500/30">📍 {{ selectedWaterBody.coord }}</p>
            </div>
            <button @click="selectedWaterBody = null" class="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors border border-slate-500">✕</button>
          </div>

          <div class="flex-1 overflow-y-auto p-6 space-y-5 relative z-10 custom-terminal-scroll">
            
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-center">
                <p class="text-[11px] text-slate-400 uppercase tracking-wider mb-2">FUI 水色指数</p>
                
                <div class="flex items-end gap-3">
                  <span class="text-5xl font-black drop-shadow-[0_0_8px_currentColor] leading-none" :class="getFUIColorText(selectedWaterBody.fui)">{{ selectedWaterBody.fui }}</span>
                  <div class="flex flex-col justify-end pb-0.5" :class="getFUIColorText(selectedWaterBody.fui)">
                    <span class="text-sm font-bold leading-tight">{{ getFUITextMain(selectedWaterBody.fui) }}</span>
                    <span class="text-[10px] font-medium opacity-80 mt-0.5">{{ getFUITextSub(selectedWaterBody.fui) }}</span>
                  </div>
                </div>

              </div>
              
              <div class="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm flex flex-col justify-center">
                <p class="text-[11px] text-slate-400 uppercase tracking-wider mb-2">估算水域面积</p>
                <div class="flex items-baseline gap-1">
                  <span class="text-4xl font-black text-white leading-none">{{ selectedWaterBody.area }}</span>
                  <span class="text-xs text-slate-400">公顷</span>
                </div>
              </div>
            </div>

            <div v-if="selectedWaterBody.fui >= 10" class="bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-700/50 rounded-2xl p-5 relative overflow-hidden">
              <h4 class="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-700 pb-3">
                <span class="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-ping"></span> 参数空间反演结果
              </h4>
              
              <div class="space-y-6">
                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold text-slate-200">叶绿素a (Chla) 浓度分布</span>
                    <span class="text-[10px] text-slate-500">单位: µg/L</span>
                  </div>
                  <div class="grid grid-cols-3 gap-2 mb-3">
                    <div class="bg-slate-800/80 rounded-lg py-1.5 text-center border border-slate-600/50">
                      <div class="text-[9px] text-slate-400 mb-0.5">MIN 最小值</div>
                      <div class="text-xs font-mono text-emerald-400 font-bold">{{ selectedWaterBody.chla.min }}</div>
                    </div>
                    <div class="bg-slate-800/80 rounded-lg py-1.5 text-center border border-slate-600/50">
                      <div class="text-[9px] text-slate-400 mb-0.5">AVG 平均值</div>
                      <div class="text-xs font-mono text-white font-bold">{{ selectedWaterBody.chla.avg }}</div>
                    </div>
                    <div class="bg-slate-800/80 rounded-lg py-1.5 text-center border border-slate-600/50">
                      <div class="text-[9px] text-slate-400 mb-0.5">MAX 最大值</div>
                      <div class="text-xs font-mono text-rose-400 font-bold">{{ selectedWaterBody.chla.max }}</div>
                    </div>
                  </div>
                  
                  <div class="rounded-lg overflow-hidden border border-slate-700 shadow-inner group relative cursor-pointer bg-slate-900">
                    <el-image :src="selectedWaterBody.chlaMap" :preview-src-list="[selectedWaterBody.chlaMap]" :preview-teleported="true" :z-index="9999" class="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105" fit="cover" hide-on-click-modal />
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span class="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">🔍 点击放大查阅</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-bold text-slate-200">悬浮物浊度 (Turbidity) 分布</span>
                    <span class="text-[10px] text-slate-500">单位: NTU</span>
                  </div>
                  <div class="grid grid-cols-3 gap-2 mb-3">
                    <div class="bg-slate-800/80 rounded-lg py-1.5 text-center border border-slate-600/50">
                      <div class="text-[9px] text-slate-400 mb-0.5">MIN 最小值</div>
                      <div class="text-xs font-mono text-emerald-400 font-bold">{{ selectedWaterBody.turbidity.min }}</div>
                    </div>
                    <div class="bg-slate-800/80 rounded-lg py-1.5 text-center border border-slate-600/50">
                      <div class="text-[9px] text-slate-400 mb-0.5">AVG 平均值</div>
                      <div class="text-xs font-mono text-white font-bold">{{ selectedWaterBody.turbidity.avg }}</div>
                    </div>
                    <div class="bg-slate-800/80 rounded-lg py-1.5 text-center border border-slate-600/50">
                      <div class="text-[9px] text-slate-400 mb-0.5">MAX 最大值</div>
                      <div class="text-xs font-mono text-amber-400 font-bold">{{ selectedWaterBody.turbidity.max }}</div>
                    </div>
                  </div>

                  <div class="rounded-lg overflow-hidden border border-slate-700 shadow-inner group relative cursor-pointer bg-slate-900">
                    <el-image :src="selectedWaterBody.turbMap" :preview-src-list="[selectedWaterBody.turbMap]" :preview-teleported="true" :z-index="9999" class="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105" fit="cover" hide-on-click-modal />
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span class="text-white text-xs font-bold bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">🔍 点击放大查阅</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-5 p-3 bg-rose-500/10 rounded-xl border border-rose-500/30">
                <p class="text-[11px] text-rose-300/90 leading-relaxed font-mono">SYS_DIAGNOSIS: 该水体像元反射率异常，短波红外波段反射峰值显著，高度疑似蓝藻水华爆发前期。建议出具预警指令。</p>
              </div>
            </div>

            <div v-else class="bg-gradient-to-br from-emerald-900/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]">
              <h4 class="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span> 水质健康状况良好
              </h4>
              <p class="text-[11px] text-emerald-300/80 leading-relaxed font-mono mt-3">SYS_STATUS: 光谱特征曲线正常，未检测到大面积悬浮物或富营养化特征，满足地表水环境常规标准。无需进行精细化要素反演。</p>
            </div>
          </div>

          <div class="p-5 shrink-0 relative z-10 border-t border-slate-700/50 bg-slate-800/80">
            <button class="w-full relative group bg-transparent">
              <div class="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-40 group-hover:opacity-70 transition duration-200"></div>
              <div class="relative bg-slate-900 border border-slate-600/50 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all flex justify-center items-center gap-2 active:scale-95">
                生成专业生态水质报告 📄
              </div>
            </button>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Fill, Stroke } from 'ol/style'
import Select from 'ol/interaction/Select'
import { ArrowLeft } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute() 
const map = ref(null)
const selectedWaterBody = ref(null)

const getFUIColorText = (fui) => {
  if (fui <= 5) return 'text-blue-400'
  if (fui <= 9) return 'text-emerald-400'
  if (fui <= 15) return 'text-yellow-400'
  return 'text-rose-400'
}
const getFUITextMain = (fui) => {
  if (fui <= 5) return '贫营养'
  if (fui <= 9) return '中营养'
  if (fui <= 15) return '富营养'
  return '极度富营养'
}
const getFUITextSub = (fui) => {
  if (fui <= 5) return '(优)'
  if (fui <= 9) return '(良)'
  if (fui <= 15) return '(轻度污染)'
  return '(污染/预警)'
}

const renderWaterVectors = () => {
  const mockGeoJson = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": { "id": "W-1001", "fui": 4, "area": 12.5 },
        "geometry": { "type": "Polygon", "coordinates": [[[118.05, 24.52], [118.08, 24.52], [118.07, 24.55], [118.05, 24.52]]] }
      },
      {
        "type": "Feature",
        "properties": { 
          "id": "W-1002", "fui": 18, "area": 8.2, 
          "chla": { min: 25.1, max: 189.4, avg: 124.5 }, 
          "turbidity": { min: 12.0, max: 105.2, avg: 89.2 },
          "chlaMap": "https://placehold.co/800x500/1e293b/10b981/png?text=Chla+Distribution+Heatmap",
          "turbMap": "https://placehold.co/800x500/1e293b/fbbf24/png?text=Turbidity+Distribution+Heatmap"
        },
        "geometry": { "type": "Polygon", "coordinates": [[[118.15, 24.48], [118.18, 24.47], [118.16, 24.45], [118.15, 24.48]]] }
      }
    ]
  }

  const waterStyle = (feature) => {
    const fui = feature.get('fui')
    let color = 'rgba(96, 165, 250, 0.6)' 
    if (fui > 5 && fui <= 9) color = 'rgba(52, 211, 153, 0.6)' 
    else if (fui > 9 && fui <= 15) color = 'rgba(250, 204, 21, 0.6)' 
    else if (fui > 15) color = 'rgba(251, 113, 133, 0.7)' 

    return new Style({
      fill: new Fill({ color }),
      stroke: new Stroke({ color: color.replace('0.6', '1').replace('0.7', '1'), width: 2 })
    })
  }

  const selectedWaterStyle = (feature) => {
    const fui = feature.get('fui')
    let strokeColor = '#60a5fa' 
    let fillColor = 'rgba(96, 165, 250, 0.3)' 
    if (fui > 5 && fui <= 9) { strokeColor = '#34d399'; fillColor = 'rgba(52, 211, 153, 0.3)' } 
    else if (fui > 9 && fui <= 15) { strokeColor = '#facc15'; fillColor = 'rgba(250, 204, 21, 0.3)' } 
    else if (fui > 15) { strokeColor = '#fb7185'; fillColor = 'rgba(251, 113, 133, 0.4)' }

    return new Style({
      fill: new Fill({ color: fillColor }),
      stroke: new Stroke({ color: strokeColor, width: 4 }) 
    })
  }

  const vectorSource = new VectorSource({ features: new GeoJSON().readFeatures(mockGeoJson, { featureProjection: 'EPSG:3857' }) })
  const vectorLayer = new VectorLayer({ source: vectorSource, style: waterStyle, className: 'animate-fade-in' })

  map.value.addLayer(vectorLayer)

  const selectInteraction = new Select({ layers: [vectorLayer], style: selectedWaterStyle })
  map.value.addInteraction(selectInteraction)
  
  selectInteraction.on('select', (e) => {
    if (e.selected.length > 0) {
      const feature = e.selected[0]
      const props = feature.getProperties()
      selectedWaterBody.value = {
        id: props.id, fui: props.fui, area: props.area,
        coord: `${feature.getGeometry().getExtent()[0].toFixed(2)}, ${feature.getGeometry().getExtent()[1].toFixed(2)}`,
        chla: props.chla || null, turbidity: props.turbidity || null,
        chlaMap: props.chlaMap || '', turbMap: props.turbMap || ''
      }
    } else {
      selectedWaterBody.value = null
    }
  })
}

const initMap = () => {
  const tiandituSatellite = new TileLayer({
    source: new XYZ({ url: 'http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=efa58a46b9929b0b10cf08d58ab86f07', projection: 'EPSG:3857' })
  })
  map.value = new Map({
    target: 'result-map', layers: [tiandituSatellite],
    view: new View({ center: fromLonLat([118.1, 24.5]), zoom: 11, minZoom: 4, maxZoom: 18 }) 
  })
  
  setTimeout(() => { renderWaterVectors() }, 500)
}

onMounted(() => { initMap() })
</script>

<style scoped>
.slide-panel-enter-active, .slide-panel-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-panel-enter-from, .slide-panel-leave-to { opacity: 0; transform: translateX(100%); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in-up { animation: fadeInUp 0.6s ease-out forwards; }
@keyframes fadeInSlow { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
.animate-fade-in-slow { animation: fadeInSlow 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.custom-terminal-scroll::-webkit-scrollbar { width: 4px; }
.custom-terminal-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-terminal-scroll::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
:deep(.ol-zoom), :deep(.ol-attribution) { display: none; }
</style>