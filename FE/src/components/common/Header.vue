<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <section id="HEADER">
    <div class="logo-header">
      <div class="img-logo">
        <img :src="Logo" alt="" />
      </div>
    </div>
    <div class="nav-header">
      <div class="div-left">
        <div class="btn-toggle-sidbar" @click="toggleSidebarFunction">
          <img :src="MenuBarIcon" alt="" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import Logo from './../../assets/images/logo.png'
import MenuBarIcon from './../../assets/icons/24px/menu-bar.png'

const emits = defineEmits(['toggleSidebar'])

const toggleSidebarFunction = () => {
  emits('toggleSidebar')
}
</script>

<style scoped>
@import url('./../../styles/Header.css');
</style>
