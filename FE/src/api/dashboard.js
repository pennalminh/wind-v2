import axios from 'axios'

const url = import.meta.env.VITE_VUE_APP_API_URL

export const callAPIGetDataForecastNextDay = async () => {
  try {
    const response = await axios.get(`${url}/data-export-power-forecast-by-96-period-in-day`)
    return response
  } catch (error) {
    throw error
  }
}

// export const getDashboardReports = () => {
//   return apiClient.get('/dashboard/reports')
// }
