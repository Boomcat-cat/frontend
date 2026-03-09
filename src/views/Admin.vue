<template>
  <div class="admin-container">
    <!-- 顶部导航栏 -->
    <nav class="nav-bar">
      <h2 class="page-title">管理员后台</h2>
      <div class="nav-right">
        <span class="username">管理员：{{ username }}</span>
        <el-button @click="handleLogout" class="logout-btn">退出登录</el-button>
      </div>
    </nav>

    <!-- 申请记录表格 -->
    <div class="table-container">
      <el-card class="table-card">
        <div class="card-header">
          <el-icon size="20" color="#165DFF"><Document /></el-icon>
          <span class="card-header-title">所有用户申请记录</span>
        </div>
        <el-table :data="records" stripe style="width: 100%" v-loading="loading">
          <el-table-column prop="task_id" label="任务ID" width="180" />
          <el-table-column prop="user_id" label="用户ID" width="100" />
          <el-table-column prop="area" label="目标区域" min-width="200" />
          <el-table-column prop="cloud_cover" label="云量上限" width="100" />
          <el-table-column prop="date_range" label="时间范围" width="200" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="申请时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-select v-model="scope.row.newStatus" placeholder="修改状态" size="small" style="width: 120px;">
                <el-option label="待处理" value="待处理" />
                <el-option label="处理中" value="处理中" />
                <el-option label="已完成" value="已完成" />
              </el-select>
              <el-button type="primary" size="small" @click="updateStatus(scope.row)">更新</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { Document } from '@element-plus/icons-vue'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '')
const loading = ref(false)
const records = ref([])

// 获取状态对应的标签类型
const getStatusType = (status) => {
  if (status === '已完成') return 'success'
  if (status === '处理中') return 'warning'
  return 'info'
}

// 获取所有申请记录
const fetchRecords = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:8000/admin/records', {
      headers: { Authorization: `Bearer ${token}` }
    })
    records.value = res.data.map(r => ({ ...r, newStatus: r.status }))
  } catch (err) {
    ElMessage.error('获取记录失败')
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 更新任务状态
const updateStatus = async (row) => {
  if (!row.newStatus) {
    ElMessage.warning('请选择状态')
    return
  }
  try {
    const token = localStorage.getItem('token')
    await axios.put('http://localhost:8000/admin/update-status', {
      task_id: row.task_id,
      status: row.newStatus
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    row.status = row.newStatus
    ElMessage.success('状态更新成功')
  } catch (err) {
    ElMessage.error('更新失败')
    console.error(err)
  }
}

// 退出登录
const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('isAdmin')
  ElMessage.success('已退出登录')
  router.push('/login')
}

onMounted(() => {
  fetchRecords()
})
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 70px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.username {
  color: #64748b;
}

.logout-btn {
  border: none;
  background: transparent;
  color: #ef4444;
}

.table-container {
  flex: 1;
  padding: 20px 40px;
}

.table-card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
}

.card-header-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}
</style>