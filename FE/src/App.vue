<script setup>
import HeaderVue from './components/common/Header.vue'
import SidebarVue from './components/common/Sidebar.vue'

const handletoggleSidebar = () => {
  const root = document.documentElement

  const currentWidth = getComputedStyle(root).getPropertyValue('--sidebar-width').trim();
  
  if (currentWidth === '0px') {
    root.style.setProperty('--sidebar-width', '300px')
  } else {
    root.style.setProperty('--sidebar-width', '0px')
  }
}
</script>

<template>
  <section id="MAIN-APP">
    <header class="header-main-app">
      <HeaderVue @toggle-sidebar="handletoggleSidebar"></HeaderVue>
    </header>
    <div id="MAIN-VIEW-APP">
      <div class="sidebar-main-app">
        <SidebarVue></SidebarVue>
      </div>
      <div class="main-view-app">
        <router-view></router-view>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
