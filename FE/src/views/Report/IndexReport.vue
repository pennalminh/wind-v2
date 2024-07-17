<template>
  <section id="MAIN-INDEX-REPORT">
    <div class="main-report">
      <div class="list-main-report">
        <div v-for="(item, index) in items" :key="index" class="report-item" @click="item.action()">
          <div class="report-item__title">{{ ++index }}. {{ item.title }}</div>
          <div class="report-item-function">
            <div class="item-fuction-btn">
              <img :src="IconExcel" alt="" />
              <span>Xuất Excel</span>
            </div>
          </div>
        </div>

        <!-- <div class="report-item">
          <div class="report-item__title">2. Dự báo công suất phát trong 2 ngày tới</div>
          <div class="report-item-function">
            <div class="item-fuction-btn">
              <img :src="IconExcel" alt="" />
              <span>Xuất Excel</span>
            </div>
          </div>
        </div> -->
      </div>
    </div>
  </section>
</template>

<script setup>
import IconReview from './../../assets/icons/24px/statistics.png'
import IconExcel from './../../assets/icons/24px/xls.png'
import { callAPIGetForecastNext2Day, callAPIGetForecastNextDay } from './../../api/report'

const exportExcelForecastNextDay = async () => {
  try {
    const response = await callAPIGetForecastNextDay()
  } catch (error) {
    console.log(error)
  }
}

const exportExcelForecastNext2Day = async () => {
  try {
    const response = await callAPIGetForecastNext2Day()
  } catch (error) {
    console.log(error)
  }
}

const items = [
  { title: 'Dự báo công suất trong ngày vận hành', action: exportExcelForecastNextDay },
  { title: 'Dự báo công suất phát trong 2 ngày tới', action: exportExcelForecastNext2Day },
  { title: 'Dự báo công suất và sản lượng tuần tới', action: null },
  { title: 'Dự báo tháng tới', action: null },
  { title: 'Dự báo năm tới', action: null },
  { title: 'Dự báo theo chọn ngày', action: null },
  { title: 'Xuất dữ liệu theo lịch sử công suất tổng thực tế', action: null }
]
</script>

<style scoped>
@import url('./../../styles/IndexReport.css');
</style>
