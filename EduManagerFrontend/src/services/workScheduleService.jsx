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

// Lấy danh sách tất cả lịch làm việc
export const getAllWorkSchedules = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/work-schedule`);
    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching work schedules:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết lịch làm việc
export const getWorkScheduleById = async (scheduleId) => {
  try {
    const response = await axios.get(`${API_URL}/api/work-schedule/${scheduleId}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching work schedule with ID ${scheduleId}:`, error);
    throw error;
  }
};

// Tạo lịch làm việc mới cho người dùng
export const createWorkSchedule = async (userId, workScheduleData) => {
  try {
    const response = await axios.post(`${API_URL}/api/work-schedule/${userId}`, workScheduleData);
    return response.data;
  } catch (error) {
    console.error('Error creating work schedule:', error);
    throw error;
  }
};

// Tạo lịch làm việc mới với nhiều người dùng
export const createWorkScheduleForMultipleUsers = async (workScheduleData) => {
  try {
    if (!workScheduleData.userIds || workScheduleData.userIds.length === 0) {
      throw new Error('Vui lòng chọn ít nhất một người dùng cho lịch làm việc');
    }

    const promises = workScheduleData.userIds.map(userId => {
      if (typeof userId !== 'string') {
        throw new Error(`Invalid userId: ${userId}`);
      }
      const { userIds, ...scheduleData } = workScheduleData;
      return axios.post(`${API_URL}/api/work-schedule/${userId}`, scheduleData);
    });

    const responses = await Promise.all(promises);
    return responses[0].data;
  } catch (error) {
    console.error('Error creating work schedule for multiple users:', error);
    throw error;
  }
};

// Cập nhật thông tin lịch làm việc
export const updateWorkSchedule = async (userId, scheduleId, workScheduleData) => {
  try {
    const response = await axios.put(`${API_URL}/api/work-schedule/${userId}/${scheduleId}`, workScheduleData);
    return response.data;
  } catch (error) {
    console.error(`Error updating work schedule with ID ${scheduleId}:`, error);
    throw error;
  }
};

// Xóa lịch làm việc
export const deleteWorkSchedule = async (userId, scheduleId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/work-schedule/${userId}/${scheduleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting work schedule with ID ${scheduleId}:`, error);
    throw error;
  }
};

// Lấy lịch làm việc trong khoảng thời gian
export const getWorkSchedulesByTimeRange = async (startTime, endTime) => {
  try {
    const response = await axios.get(`${API_URL}/api/work-schedule/${startTime}/${endTime}`);
    return response.data.result || [];
  } catch (error) {
    console.error(`Error fetching work schedules for time range:`, error);
    throw error;
  }
};

// Lấy lịch làm việc của một người dùng
export const getUserWorkSchedules = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/work-schedule/user/${userId}`);
    return response.data.result || [];
  } catch (error) {
    console.error(`Error fetching work schedules for user ${userId}:`, error);
    throw error;
  }
};

// Lấy lịch làm việc của riêng từng người dùng
export const getUserWorkSchedulesByUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/work-schedule/myWorkSchedule`);
    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching user work schedules:', error);
    throw error;
  }
};
// Tạo object service để export default
const WorkScheduleService = {
  getAllWorkSchedules,
  getWorkScheduleById,
  createWorkSchedule,
  createWorkScheduleForMultipleUsers,
  updateWorkSchedule,
  deleteWorkSchedule,
  getWorkSchedulesByTimeRange,
  getUserWorkSchedules,
  getUserWorkSchedulesByUser
};

export default WorkScheduleService;