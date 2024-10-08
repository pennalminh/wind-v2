import axios from 'axios'

const url = import.meta.env.VITE_VUE_APP_API_URL

export const callAPIGetForecastToDay = async () => {
  try {
    const response = await axios.post(`${url}/export-csv-in-day`)
    alert('Xuất thành công')
  } catch (error) {
    alert('Xuất không thành công, có lỗi xảy ra')
    throw error
  }
}

export const callAPIGetForecastNextDay = async () => {
  try {
    const response = await axios.post(`${url}/export-csv-in-next-day`)
    alert('Xuất thành công')
  } catch (error) {
    alert('Xuất không thành công, có lỗi xảy ra')
    throw error
  }
}

export const callAPIGetForecastNext2Day = async () => {
  try {
    const response = await axios.post(`${url}/export-csv-in-next-2-day`)
    alert('Xuất thành công')
  } catch (error) {
    alert('Xuất không thành công, có lỗi xảy ra')
    throw error
  }
}
