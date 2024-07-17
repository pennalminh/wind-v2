<template>
  <section id="MAIN-INDEX-DASHBOARD">
    <div class="main-dashboard">
      <div class="breadcrumb-dashboard">
        <div style="display: flex; justify-content: center; color: aliceblue">
          <h1>BIỂU ĐỒ</h1>
        </div>
      </div>
      <div class="header-dashboard"></div>
      <div class="chart-main">
        <div class="header-chart">
          <div class="left-header-chart">
            <div class="filter-date">
              <div class="input-date">
                <label for="">Từ :</label>
                <input type="date" v-model="startDay" />
              </div>
              <div class="input-date">
                <label for="">Đến: </label>
                <input type="date" v-model="endDay" />
              </div>
              <div @click="loadChart()">
                <button class="btn-search">Tra cứu</button>
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
import IconFull from './../../assets/icons/24px/preview.png'
import Chart from 'chart.js/auto'
import { onMounted, ref } from 'vue'
import { callAPIGetDataForecastNextDay } from '@/api/dashboard'

const chartElement = ref(null)
let chartInstance = null
const getYesterday = () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday
}

const getDaysBetweenDates = (date1, date2) => {
  // Tạo đối tượng Date từ chuỗi ngày tháng
  const firstDate = new Date(date1)
  const secondDate = new Date(date2)

  // Tính toán sự khác biệt về thời gian giữa hai ngày (tính bằng milliseconds)
  const timeDifference = Math.abs(secondDate - firstDate)

  // Chuyển đổi sự khác biệt từ milliseconds sang ngày
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

  return daysDifference
}

const startDay = ref(getYesterday().toISOString().slice(0, 10))
const endDay = ref(new Date().toISOString().slice(0, 10))

onMounted(async () => {
  await loadChart()
  chartInstance = new Chart(chartElement.value, configDataChart)
})

const loadChart = async () => {
  const response = await featchDataForecastNextDay()
  dataChart.value.datasets[0].data = response.data.actual
  dataChart.value.datasets[1].data = response.data.predict

  const days = getDaysBetweenDates(startDay.value, endDay.value)
  dataChart.value.labels = Array.from({ length: 96 * days }, (_, i) => i + 1)

  if (chartInstance) {
    chartInstance.update()
  }
}

const featchDataForecastNextDay = async () => {
  try {
    const response = await callAPIGetDataForecastNextDay(startDay.value, endDay.value)
    console.log(response)
    return response
  } catch (error) {
    console.log(error)
  }
}

const dataChart = ref({
  labels: 1,
  datasets: [
    {
      label: 'Công suất thực tế',
      data: [1, 2, 3],
      fill: false,
      borderColor: 'yellow',
      backgroundColor: 'yellow',
      tension: 0.3
    },
    {
      label: 'Công suất dự báo',
      data: [],
      fill: false,
      borderColor: 'red',
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
