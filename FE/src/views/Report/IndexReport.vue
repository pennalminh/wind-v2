<template>
  <section id="MAIN-INDEX-REPORT">
    <div class="main-report">
      <div class="list-main-report">
        <div class="report-item" @click="exportExcelForecastNextDay()">
          <div class="report-item__title">1. Dự báo công suất trong ngày vận hành</div>
          <div class="report-item-function">
            <div class="item-fuction-btn">
              <img :src="IconReview" alt="" />
              <span>Xem báo cáo</span>
            </div>
            <div class="item-fuction-btn">
              <img :src="IconExcel" alt="" />
              <span>Xuất Excel</span>
            </div>
          </div>
        </div>

        <div class="report-item">
          <div class="report-item__title">2. Dự báo công suất phát trong 2 ngày tới</div>
          <div class="report-item-function">
            <div class="item-fuction-btn">
              <img :src="IconReview" alt="" />
              <span>Xem báo cáo</span>
            </div>
            <div class="item-fuction-btn">
              <img :src="IconExcel" alt="" />
              <span>Xuất Excel</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import IconReview from './../../assets/icons/24px/statistics.png'
import IconExcel from './../../assets/icons/24px/xls.png'
import { callAPIGetForecastNextDay } from './../../api/report'

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
</script>

<style scoped>
@import url('./../../styles/IndexReport.css');
</style>
