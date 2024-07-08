import { createRouter, createWebHistory } from 'vue-router'
import IndexDashboardVue from '@/views/Dashboard/IndexDashboard.vue'
import IndexReportVue from '@/views/Report/IndexReport.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: IndexDashboardVue
    },
    {
      path: '/report',
      name: 'Report',
      component: IndexReportVue
    }
  ]
})

export default router
