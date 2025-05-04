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

// Lấy danh sách tất cả loại nhân viên
export const getAllStaffTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/staff-types`);
    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching staff types:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết loại nhân viên
export const getStaffTypeById = async (staffTypeId) => {
  try {
    const response = await axios.get(`${API_URL}/api/staff-types/${staffTypeId}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching staff type with ID ${staffTypeId}:`, error);
    throw error;
  }
};

// Tạo mới loại nhân viên
export const createStaffType = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/staff-types`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating staff type:', error);
    throw error;
  }
};

// Cập nhật loại nhân viên
export const updateStaffType = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/api/staff-types/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating staff type with ID ${id}:`, error);
    throw error;
  }
};

// Xóa loại nhân viên
export const deleteStaffType = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/api/staff-types/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting staff type with ID ${id}:`, error);
    throw error;
  }
};