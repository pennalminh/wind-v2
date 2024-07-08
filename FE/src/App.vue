<script setup>
import HeaderVue from './components/common/Header.vue'
import SidebarVue from './components/common/Sidebar.vue'
</script>

<template>
  <section id="MAIN-APP">
    <header class="header-main-app">
      <HeaderVue></HeaderVue>
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
