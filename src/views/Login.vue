<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">水体遥感监测平台</h1>
      <el-tabs v-model="activeTab" class="login-tabs">
        <!-- 登录 -->
        <el-tab-pane label="登录" name="login">
          <el-form :model="loginForm" label-width="80px" class="login-form">
            <el-form-item label="用户名">
              <el-input v-model="loginForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-button type="primary" size="large" class="login-btn" :loading="loading" @click="handleLogin">
              登录
            </el-button>
          </el-form>
          <p class="login-tip">默认管理员账号：admin / admin123</p>
        </el-tab-pane>

        <!-- 注册 -->
        <el-tab-pane label="注册" name="register">
          <el-form :model="registerForm" label-width="80px" class="login-form">
            <el-form-item label="用户名">
              <el-input v-model="registerForm.username" placeholder="请输入用户名" />
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-button type="success" size="large" class="login-btn" :loading="loading" @click="handleRegister">
              注册
            </el-button>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const activeTab = ref('login')
const loading = ref(false)

const loginForm = ref({
  username: '',
  password: ''
})

const registerForm = ref({
  username: '',
  password: ''
})

// 登录
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    // 用FormData格式提交登录
    const formData = new FormData()
    formData.append('username', loginForm.value.username)
    formData.append('password', loginForm.value.password)
    const res = await axios.post('http://localhost:8000/login', formData)
    // 保存登录状态
    localStorage.setItem('token', res.data.access_token)
    localStorage.setItem('username', res.data.username)
    localStorage.setItem('isAdmin', res.data.is_admin)
    ElMessage.success('登录成功！')
    // 管理员跳转到管理员页面，普通用户跳转到首页
    if (res.data.is_admin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  } catch (err) {
    ElMessage.error(err.response?.data?.detail || '登录失败')
  } finally {
    loading.value = false
  }
}

// 注册
const handleRegister = async () => {
  if (!registerForm.value.username || !registerForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  loading.value = true
  try {
    await axios.post('http://localhost:8000/register', registerForm.value)
    ElMessage.success('注册成功，请登录！')
    activeTab.value = 'login'
  } catch (err) {
    ElMessage.error(err.response?.data?.detail || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 400px;
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 30px;
}

.login-tabs {
  margin-bottom: 20px;
}

.login-form {
  margin-top: 20px;
}

.login-btn {
  width: 100%;
  height: 48px;
  border-radius: 8px;
  font-size: 16px;
  margin-top: 10px;
}

.login-tip {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 20px;
}
</style>