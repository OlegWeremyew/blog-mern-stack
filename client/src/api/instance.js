import axios from "axios";

export const instance = axios.create({
  baseURL: 'http://localhost:4444'
})

instance.interceptors.request.use((config) => {
  config.headers.Authorizations = localStorage.getItem('token')

  return config
})
