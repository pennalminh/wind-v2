<template>
  <section id="MAIN-INDEX-DASHBOARD">
    <div class="main-dashboard">
      <div class="breadcrumb-dashboard">
        <div class="btn-text-default">
          <span>BIỂU ĐỒ</span>
        </div>
      </div>
      <div class="header-dashboard">
        <!-- <div class="list-card">
          <div class="card" v-for="n in 3" :key="n">
            <div class="card-header">
              <div class="card-title">
                <h3>Card Title</h3>
              </div>
            </div>
            <div class="card-body">
              <div class="card-content-body">
                <h3>100</h3>
              </div>
            </div>
            <div class="card-footer">
              <div class="card-footer-title">
                <h3>Xem chi tiết</h3>
              </div>
            </div>
          </div>
        </div> -->
      </div>
      <div class="chart-main">
        <div class="header-chart">
          <div class="left-header-chart">
            <div class="filter-date">
              <div class="input-date">
                <label for="">Từ :</label>
                <input type="date" />
              </div>
              <div class="input-date">
                <label for="">Đến: </label>
                <input type="date" />
                </div>
            </div>
          </div>
          <div class="right-header-chart">
            <div class="btn-icon-default" title="Phóng to">
              <img :src="IconFull" alt="" />
            </div>
          </div>
        </div>
        <hr />
        <div class="body-chart">
          <canvas id="myChart" ref="chartElement"></canvas>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import IconDashboard from './../../assets/icons/32px/menu.png'
import IconFull from './../../assets/icons/24px/preview.png'
import Chart from 'chart.js/auto'
import { onMounted, ref } from 'vue'
import { callAPIGetDataForecastNextDay } from '@/api/dashboard'

const chartElement = ref(null)

onMounted(async () => {
  const response = await featchDataForecastNextDay()
  dataChart.value.datasets[0].data = response.data
  new Chart(chartElement.value, configDataChart)
})

const featchDataForecastNextDay = async () => {
  try {
    const response = await callAPIGetDataForecastNextDay()
    return response
  } catch (error) {
    console.log(error)
  }
}

const labels = Array.from({ length: 96 }, (_, i) => i + 1)

const dataChart = ref({
  labels: labels,
  datasets: [
    {
      label: 'Năng lượng dự báo trong một ngày tới trong ngày (96 khung giờ)',
      data: [],
      fill: false,
      borderColor: 'blue',
      backgroundColor: 'red',
      tension: 0.3
    }
  ]
})

const configDataChart = {
  type: 'line',
  data: dataChart.value,
  options: {
    responsive: true,
    scales: {
      x: {
        display: true
      },
      y: {
        display: true
      }
    }
  }
}
</script>

<style scoped>
@import url('./../../styles/IndexDashboard.css');
</style>
