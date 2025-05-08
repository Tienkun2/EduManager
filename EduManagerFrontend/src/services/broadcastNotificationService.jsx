import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8080/api/broadcast-notifications';

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

/**
 * Tạo một thông báo hàng loạt
 * @param {Object} broadcastData - Dữ liệu thông báo: { notificationId, targetRole, targetDepartmentId, targetStaffTypeId }
 * @returns {Promise} - Promise trả về response từ API
 */
export const createBroadcastNotification = async (broadcastData) => {
  try {
    const response = await axios.post(API_URL, broadcastData);
    return response.data;
  } catch (error) {
    console.error('Error creating broadcast notification:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết thông báo hàng loạt theo ID
 * @param {string} id - ID của thông báo hàng loạt
 * @returns {Promise} - Promise trả về thông tin thông báo
 */
export const getBroadcastNotificationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching broadcast notification with ID ${id}:`, error);
    throw error;
  }
};