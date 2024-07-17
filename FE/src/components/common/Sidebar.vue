<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <section id="SIDEBAR">
    <nav>
      <ul>
        <li
          v-for="menu in navMenu"
          :key="menu"
          :class="{ 'active-li': menu.status == 'active' }"
          @click="handleClickMenu(menu)"
        >
          <router-link
            :to="menu.link"
            class="router-link"
            :class="{ 'active-router-link': menu.status == 'active' }"
          >
            <img :src="menu.icon" alt="" />
            <span>{{ menu.name }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </section>
</template>

<script setup>
import DashboardIcon from './../../assets/icons/32px/menu.png'
import ReportIcon from './../../assets/icons/32px/chart.png'

import { onMounted, ref } from 'vue'

const navMenu = ref([
  {
    id: '#dashboard',
    name: 'Biểu đồ',
    icon: DashboardIcon,
    link: '/',
    status: 'active'
  },
  {
    id: '#report',
    name: 'Báo cáo',
    icon: ReportIcon,
    link: '/report',
    status: 'none'
  }
])

const localStorageValue = ref()

onMounted(() => {
  if (localStorage.getItem('menuActive')) {
    activeMenuMounted(localStorage.getItem('menuActive'))
  } else {
    localStorage.setItem('menuActive', '#dashboard')
  }
})

const handleClickMenu = (menu) => {
  navMenu.value.forEach((item) => {
    item.status = 'none'
  })
  menu.status = 'active'
  localStorage.setItem('menuActive', menu.id)
}

const activeMenuMounted = (id) => {
  navMenu.value.forEach((item) => {
    item.status = 'none'
    if (item.id == id) {
      item.status = 'active'
    }
  })
}
</script>

<style scoped>
@import url('./../../styles/Sidebar.css');
</style>
