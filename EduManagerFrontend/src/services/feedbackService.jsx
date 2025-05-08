import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8080/api/feedbacks';

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
 * Tạo một phản hồi mới
 * @param {Object} feedbackData - Dữ liệu phản hồi: { userId, title, content }
 * @returns {Promise} - Promise trả về response từ API
 */
export const createFeedback = async (feedbackData) => {
    try {
      console.log('Sending feedback data:', feedbackData);
      const response = await axios.post(API_URL, feedbackData);
      console.log('Feedback response:', response.data);
      return response.data.result;
    } catch (error) {
      console.error('Error creating feedback:', error.response?.data || error.message);
      throw error;
    }
  };

/**
 * Cập nhật thông tin phản hồi
 * @param {string} id - ID của phản hồi
 * @param {Object} feedbackData - Dữ liệu cập nhật: { title, content, status }
 * @returns {Promise} - Promise trả về response từ API
 */
export const updateFeedback = async (id, feedbackData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, feedbackData);
    return response.data.result;
  } catch (error) {
    console.error(`Error updating feedback with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Xóa phản hồi
 * @param {string} id - ID của phản hồi
 * @returns {Promise} - Promise trả về response từ API
 */
export const deleteFeedback = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting feedback with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Lấy danh sách phản hồi của một người dùng
 * @returns {Promise} - Promise trả về danh sách phản hồi
 */
export const getFeedbacksByUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching feedbacks for user:', error);
    throw error;
  }
};

/**
 * Lấy chi tiết phản hồi theo ID
 * @param {string} id - ID của phản hồi
 * @returns {Promise} - Promise trả về thông tin phản hồi
 */
export const getFeedbackById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching feedback with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Lấy danh sách tất cả phản hồi
 * @returns {Promise} - Promise trả về danh sách phản hồi
 */
export const getAllFeedbacks = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching all feedbacks:', error);
    throw error;
  }
};