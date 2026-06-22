import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('Network Error:', error.message);
      return Promise.reject({ message: 'Network error. Please check your connection.' });
    } else {
      console.error('Request Error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export const apiService = {
  createEvent: (eventData) => api.post('/events', eventData),
  getEvents: () => api.get('/events'),

  getAllSessions: () => api.get('/sessions'),
  getSessionById: (sessionId) => api.get(`/sessions/${sessionId}`),

  getStats: () => api.get('/stats'),

  getHeatmapData: (pageUrl) => api.get('/heatmap', { params: { page: pageUrl } }),
  getPagesWithClicks: () => api.get('/heatmap/pages'),
};

export default api;
