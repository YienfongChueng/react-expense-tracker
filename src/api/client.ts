import axios from 'axios'
const BASE_URL = 'http://localhost:3002'

export const client = axios.create({
    baseURL: BASE_URL,
})

client.interceptors.request.use(config => {
    // const token = localStorage.getItem('token')
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`
    // }
    return config
})

client.interceptors.response.use(response => {
    return response
}, error => {
    return Promise.reject(error)
})