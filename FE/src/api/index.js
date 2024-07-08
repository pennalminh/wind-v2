// import axios from 'axios'
// const apiEnv = import.meta.env.VITE_VUE_APP_API_URL

// const apiClient = axios.create({
//   baseURL: apiEnv,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

// apiClient.interceptors.request.use(
//   (config) => {
//     // Có thể thêm logic để thêm token vào headers nếu cần thiết
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// apiClient.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   (error) => {
//     // Xử lý lỗi nếu cần thiết
//     return Promise.reject(error)
//   }
// )

// export default apiClient
