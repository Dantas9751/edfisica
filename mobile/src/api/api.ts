import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const login = async (credentials: { email: string; password: string }) =>
  api.post('/auth/login', credentials);

export const logout = async () => api.post('/auth/logout');

export const verifyPassword = async (data: { password: string }) =>
  api.post('/auth/verify-password', data);

export const getUser = async () => api.get('/user');


export const registrarRefeicao = async () => api.post('/refeicao');

export const getAlunos = async () => api.get('/alunos');

export default api;