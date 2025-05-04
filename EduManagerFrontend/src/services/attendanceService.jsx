import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8080/api';

axios.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const getAllAttendances = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/attendances`, { params });
    console.log('Raw API Response:', response.data); // Debug log
    // Normalize status to lowercase
    const normalizedData = {
      ...response.data,
      result: response.data.result.map(item => ({
        ...item,
        status: item.status.toLowerCase()
      }))
    };
    console.log('Normalized Data:', normalizedData); // Debug log
    return normalizedData;
  } catch (error) {
    console.error('Error fetching attendances:', error);
    throw error;
  }
};

export const getAttendanceById = async (attendanceId) => {
  try {
    const response = await axios.get(`${API_URL}/attendances/${attendanceId}`);
    // Normalize status to lowercase
    const normalizedItem = {
      ...response.data.result,
      status: response.data.result.status.toLowerCase()
    };
    console.log('Normalized AttendanceById:', normalizedItem); // Debug log
    return normalizedItem;
  } catch (error) {
    console.error(`Error fetching attendance with ID ${attendanceId}:`, error);
    throw error;
  }
};

export const createAttendance = async (attendanceData) => {
  try {
    const response = await axios.post(`${API_URL}/attendances`, {
      ...attendanceData,
      status: attendanceData.status.toUpperCase() // Send uppercase to backend
    });
    return response.data.result;
  } catch (error) {
    console.error('Error creating attendance:', error);
    throw error;
  }
};

export const updateAttendance = async (attendanceId, attendanceData) => {
  try {
    const response = await axios.put(`${API_URL}/attendances/${attendanceId}`, {
      ...attendanceData,
      status: attendanceData.status.toUpperCase() // Send uppercase to backend
    });
    return response.data.result;
  } catch (error) {
    console.error(`Error updating attendance with ID ${attendanceId}:`, error);
    throw error;
  }
};

export const deleteAttendance = async (attendanceId) => {
  try {
    const response = await axios.delete(`${API_URL}/attendances/${attendanceId}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error deleting attendance with ID ${attendanceId}:`, error);
    throw error;
  }
};

export const bulkCreateAttendance = async (attendanceDataArray) => {
  try {
    const response = await axios.post(`${API_URL}/attendances/bulk`, attendanceDataArray.map(item => ({
      ...item,
      status: item.status.toUpperCase() // Send uppercase to backend
    })));
    return response.data.result;
  } catch (error) {
    console.error('Error creating bulk attendance:', error);
    throw error;
  }
};