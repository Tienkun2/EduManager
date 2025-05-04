import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8080/api';
export const TOKEN_KEY = 'auth_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          logout(); // Đăng xuất nếu không có refresh token
          return Promise.reject(error);
        }
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          token: refreshToken,
        });
        if (response.data && response.data.code === 46 && response.data.result.authenticated) {
          localStorage.setItem(TOKEN_KEY, response.data.result.token);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.result.token}`;
          return api(originalRequest);
        } else {
          logout(); // Đăng xuất nếu refresh token không hợp lệ
          return Promise.reject(error);
        }
      } catch (refreshError) {
        logout(); // Đăng xuất nếu có lỗi khi refresh
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const checkAdminRole = (token) => {
  try {
    const decoded = jwtDecode(token);
    const scope = decoded.scope || '';
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired || !scope.includes('ROLE_ADMIN')) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};

const checkUserRole = (token) => {
  try {
    const decoded = jwtDecode(token);
    const scope = decoded.scope || '';
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired || !scope.includes('ROLE_USER')) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error decoding token:', error);
    return false;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post(`/auth/login`, { email, password });
    if (response.data && response.data.code === 0 && response.data.result.authenticated) {
      const token = response.data.result.token;
      const isAdmin = checkAdminRole(token);
      const isUser = checkUserRole(token);
      if (!isAdmin && !isUser) {
        return { success: false, error: 'Bạn không có quyền truy cập vào hệ thống' };
      }
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
      // Lưu thông tin người dùng vào localStorage
      const decoded = jwtDecode(token);
      const user = {
        id: decoded.sub || decoded.id,
        fullName: decoded.name || decoded.fullName || email,
        email: decoded.email || email,
      };
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, data: { token, isAdmin } };
    }
    return { success: false, error: 'Đăng nhập thất bại' };
  } catch (error) {
    return { success: false, error: error.response?.data?.message || 'Đã xảy ra lỗi khi đăng nhập' };
  }
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem('currentUser');
};

export const isAuthenticated = (requiredRole) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return false;
  }
  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      logout(); // Xóa token nếu đã hết hạn
      return false;
    }
    if (requiredRole === 'ADMIN') {
      return checkAdminRole(token);
    }
    if (requiredRole === 'USER') {
      return checkUserRole(token);
    }
    return false;
  } catch (error) {
    console.error('Error decoding token:', error);
    logout(); // Xóa token nếu có lỗi
    return false;
  }
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getCurrentUser = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userString = localStorage.getItem('currentUser');
  if (!token || !userString) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired) {
      logout();
      return null;
    }
    return JSON.parse(userString);
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const createAuthHeader = () => {
  const token = getToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const authRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url,
      ...createAuthHeader(),
    };
    if (data) {
      config.data = data;
    }
    return await api(config);
  } catch (error) {
    throw error;
  }
};