import axios from 'axios'

const url = import.meta.env.VITE_VUE_APP_API_URL

export const callAPIGetDataForecastNextDay = async (startDay, endDay) => {
  try {
    const response = await axios.post(`${url}/data-export-power-forecast-by-96-period`, {
      startDay: startDay,
      endDay: endDay
    })
    return response
  } catch (error) {
    throw error
  }
}
