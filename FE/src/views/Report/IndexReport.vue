<template>
  <section id="MAIN-INDEX-REPORT">
    <div class="main-report">
      <div class="list-main-report">
        <div v-for="(item, index) in items" :key="index" class="report-item">
          <div class="report-item__title">{{ ++index }}. {{ item.title }}</div>
          <div class="report-item-function">
            <div class="dropdown-container" v-if="item.options">
              <select v-model="item.selectedOption" id="resolution">
                {{
                  (item.selectedOption = item.options[0].value)
                }}
                <option v-for="(option, index) in item.options" :key="index" :value="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div class="item-fuction-btn" @click="item.action(item.selectedOption)">
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
import IconExcel from './../../assets/icons/24px/xls.png'
import {
  callAPIGetForecastNext2Day,
  callAPIGetForecastNextDay,
  callAPIGetForecastNextWeek,
  callAPIGetForecastToDay
} from './../../api/report'

const exportExcelForecastToDay = async () => {
  try {
    const response = await callAPIGetForecastToDay()
  } catch (error) {
    console.log(error)
  }
}

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

const exportExcelForecastNextWeek = async (period) => {
  try {
    const response = await callAPIGetForecastNextWeek(period)
  } catch (error) {
    console.log(error)
  }
}

const items = [
  {
    title: 'Dự báo công suất trong ngày vận hành',
    action: exportExcelForecastToDay,
    options: [{ label: '15 phút', value: '15m' }]
  },
  {
    title: 'Dự báo công suất phát trong ngày tới',
    action: exportExcelForecastNextDay,
    options: [{ label: '15 phút', value: '30m' }]
  },
  {
    title: 'Dự báo công suất phát ngày kia',
    action: exportExcelForecastNext2Day,
    options: [{ label: '30 phút', value: '30m' }]
  },
  {
    title: 'Dự báo công suất và sản lượng tuần tới',
    action: exportExcelForecastNextWeek,
    options: [
      { label: '30 phút', value: '30' },
      { label: '60 phút', value: '60' }
    ]
  },
  { title: 'Dự báo tháng tới', action: null },
  { title: 'Dự báo năm tới', action: null },
  { title: 'Dự báo theo chọn ngày', action: null },
  { title: 'Xuất dữ liệu theo lịch sử công suất tổng thực tế', action: null }
]
</script>

<style scoped>
@import url('./../../styles/IndexReport.css');
</style>
