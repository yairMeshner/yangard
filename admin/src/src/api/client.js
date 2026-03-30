import axios from 'axios'
import { getSession } from './session'
export { setSession } from './session'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  config.headers['X-User-UUID'] = getSession()
  return config
})

export function getReport(from, to) {
  return api.get(`/api/report?from_date=${from}&to_date=${to}`)
}

export function register(name, email, password) {
  return api.post('/api/register', { name, email, password })
}

export function login(email, password) {
  return api.post('/api/login', { email, password })
}

export function getChild() {
  return api.get('/api/child')
}

export function createChild(data) {
  return api.post('/api/child', data)
}

export function updateChild(data) {
  return api.patch('/api/child', data)
}
