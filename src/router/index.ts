import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import DroneMonitor from "../views/DroneMonitor.vue";
import SatelliteMonitor from "../views/SatelliteMonitor.vue";
import SatelliteMonitorResult from "../views/SatelliteMonitorResult.vue";
import Login from "../views/Login.vue";
import UserCenter from "../views/UserCenter.vue";
import Admin from "../views/Admin.vue";


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/drone', name: 'DroneMonitor', component: DroneMonitor },
  { path: '/user-center', name: 'UserCenter', component: UserCenter },
  { path: '/satellite', name: 'SatelliteMonitor', component: SatelliteMonitor },
  { path: '/satellite/processing-result', name: 'SatelliteMonitorResult', component: SatelliteMonitorResult },
  { path: '/admin', name: 'Admin', component: Admin, meta: { requiresAdmin: true } }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫：检查登录状态
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  // 如果去管理员页面，检查是否是管理员
  if (to.meta.requiresAdmin) {
    if (!token || !isAdmin) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
