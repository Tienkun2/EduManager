import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8080/api/notifications';

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
 * Tạo một thông báo mới
 * @param {Object} notificationData - Dữ liệu thông báo: { senderId, receiverId, title, content, type }
 * @returns {Promise} - Promise trả về response từ API
 */
export const createNotification = async (notificationData) => {
  try {
    const response = await axios.post(API_URL, notificationData);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Cập nhật thông tin thông báo
 * @param {string} id - ID của thông báo
 * @param {Object} notificationData - Dữ liệu cập nhật: { senderId, receiverId, title, content, type }
 * @returns {Promise} - Promise trả về response từ API
 */
export const updateNotificationInfo = async (id, notificationData) => {
  try {
    const response = await axios.put(`${API_URL}/info/${id}`, notificationData);
    return response.data;
  } catch (error) {
    console.error(`Error updating notification info with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa thông báo
 * @param {string} id - ID của thông báo
 * @returns {Promise} - Promise trả về response từ API
 */
export const deleteNotification = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting notification with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Lấy danh sách thông báo của một người dùng
 * @returns {Promise} - Promise trả về danh sách thông báo
 */
export const getNotificationsForUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching notifications for user:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết thông báo theo ID
 * @param {string} id - ID của thông báo
 * @returns {Promise} - Promise trả về thông tin thông báo
 */
export const getNotificationById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching notification with ID ${id}:`, error);
    throw error;
  }
};


/**
 * Đánh dấu thông báo là đã đọc
 * @param {string} id - ID của thông báo
 * @returns {Promise} - Promise trả về response từ API
 */
export const markNotificationAsRead = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { status: 'READ' });
    return response.data.result;
  } catch (error) {
    console.error(`Error marking notification as read with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Đánh dấu tất cả thông báo là đã đọc
 * @returns {Promise} - Promise trả về response từ API
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axios.put(`${API_URL}/mark-all-read`);
    return response.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả thông báo
 * @returns {Promise} - Promise trả về danh sách thông báo
 */
export const getAllNotification = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching all notifications:', error);
    throw error;
  }
};