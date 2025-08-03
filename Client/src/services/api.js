import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};


export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getDoctors: (params) => api.get('/users/doctors', { params }),
};


export const appointmentsAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.patch(`/appointments/${id}/cancel`),
  confirm: (id) => api.patch(`/appointments/${id}/confirm`),
  getMyAppointments: (params) => api.get('/appointments/my', { params }),
};


export const scheduleAPI = {
  getDoctorSchedule: (doctorId, params) => api.get(`/schedule/doctor/${doctorId}`, { params }),
  updateSchedule: (data) => api.put('/schedule', data),
  getAvailableSlots: (doctorId, date) => api.get(`/schedule/available/${doctorId}/${date}`),
};


export const mlAPI = {
  getDoctorRecommendations: (symptoms) => api.post('/ml/recommend-doctors', { symptoms }),
  predictAppointmentDuration: (appointmentData) => api.post('/ml/predict-duration', appointmentData),
  getHealthInsights: (patientData) => api.post('/ml/health-insights', patientData),
};


export const dashboardAPI = {
  getStats: (role) => api.get(`/dashboard/stats/${role}`),
  getRecentActivity: (role) => api.get(`/dashboard/activity/${role}`),
};

export default api;
