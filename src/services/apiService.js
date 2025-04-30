import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7024/api',
  headers: { 'Content-Type': 'application/json' }
});

const ApiService = {
  getModos: () => api.get('/modo'),
  createModo: (modo) => api.post('/modo', modo),
  login: (credentials) => api.post('/Login/login', credentials),
  register: (username, password) => {
    return api.post(`/Login/register`, {
      username,
      password,
    });
  }
};

export default ApiService;