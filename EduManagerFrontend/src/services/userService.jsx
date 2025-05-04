// services/userService.jsx
import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8080';

// Thêm token vào header của request
axios.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Lấy danh sách tất cả user
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/users`);
    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Thêm user mới
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết user
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/${userId}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
};

// Cập nhật thông tin user
export const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/api/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    throw error;
  }
};

// Lấy thông tin người dùng hiện tại
export const getUserInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/users/myInfo`);
    return response.data.result;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

// Xóa user
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
};