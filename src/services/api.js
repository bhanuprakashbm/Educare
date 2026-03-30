import axios from 'axios';

// Axios baseURL is set in AuthContext to '/api' (proxied to localhost:5000 in dev)

// ── Auth ──────────────────────────────────────────────
export const authAPI = {
  login: (data) => axios.post('/auth/login', data),
  register: (data) => axios.post('/auth/register', data),
  getMe: () => axios.get('/auth/me'),
  updateProfile: (data) => axios.put('/auth/profile', data),
  changePassword: (data) => axios.put('/auth/change-password', data),
};

// ── Students ──────────────────────────────────────────
export const studentAPI = {
  getAll: (params) => axios.get('/students', { params }),
  getById: (id) => axios.get(`/students/${id}`),
  getByAadhar: (aadhar) => axios.get(`/students/aadhar/${aadhar}`),
  getStats: () => axios.get('/students/stats'),
  create: (data) => axios.post('/students', data),
  update: (id, data) => axios.put(`/students/${id}`, data),
  delete: (id) => axios.delete(`/students/${id}`),
  addAcademicRecord: (id, data) => axios.post(`/students/${id}/academic-records`, data),
};

// ── Faculty ───────────────────────────────────────────
export const facultyAPI = {
  getAll: (params) => axios.get('/faculty', { params }),
  getById: (id) => axios.get(`/faculty/${id}`),
  getStats: () => axios.get('/faculty/stats'),
  create: (data) => axios.post('/faculty', data),
  update: (id, data) => axios.put(`/faculty/${id}`, data),
  delete: (id) => axios.delete(`/faculty/${id}`),
};

// ── Institutions ──────────────────────────────────────
export const institutionAPI = {
  getAll: (params) => axios.get('/institutions', { params }),
  getById: (id) => axios.get(`/institutions/${id}`),
  getAnalytics: () => axios.get('/institutions/analytics'),
  create: (data) => axios.post('/institutions', data),
  update: (id, data) => axios.put(`/institutions/${id}`, data),
};
