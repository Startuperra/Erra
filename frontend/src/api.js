import axios from 'axios';
import WebApp from '@twa-dev/sdk';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authenticateTelegram = async () => {
  try {
    const initData = WebApp.initData;
    // Mahalliy test uchun initData yo'q bo'lsa
    if (!initData) {
        console.warn("initData topilmadi. Telegram ichidan kirmadingiz.");
        return false;
    }
    const response = await axios.post(`${BASE_URL}/auth/telegram/`, { initData });
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    return true;
  } catch (error) {
    console.error("Auth error:", error);
    return false;
  }
};

export default api;
