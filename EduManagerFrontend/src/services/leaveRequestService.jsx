import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8080';

// Add token to request headers
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

// Create a new leave request
export const createLeaveRequest = async (requestData) => {
  try {
    const response = await axios.post(`${API_URL}/api/leave-requests`, requestData);
    return response.data.result;
  } catch (error) {
    console.error('Error creating leave request:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

// Get a specific leave request by id
export const getLeaveRequestById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/leave-requests/${id}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching leave request with ID ${id}:`, error);
    throw error;
  }
};

// Get all leave requests (paginated) with filters
export const getAllLeaveRequests = async (page = 0, size = 10, filterParams = {}) => {
  try {
    const params = new URLSearchParams({
      page,
      size,
      sort: 'startDate,desc',
    });

    if (filterParams.startDate) params.append('startDate', filterParams.startDate);
    if (filterParams.endDate) params.append('endDate', filterParams.endDate);
    if (filterParams.searchKeyword) params.append('searchKeyword', filterParams.searchKeyword);
    if (filterParams.leaveType) params.append('leaveType', filterParams.leaveType);

    const response = await axios.get(`${API_URL}/api/leave-requests?${params.toString()}`);
    return {
      content: response.data.content || [],
      totalElements: response.data.totalElements || 0,
      pageable: response.data.pageable || { pageSize: size },
    };
  } catch (error) {
    console.error('Error fetching all leave requests:', error);
    throw error;
  }
};

// Get leave requests by user id
export const getLeaveRequestsByUserId = async (userId, page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/leave-requests/user/${userId}?page=${page}&size=${size}&sort=startDate,desc`
    );
    return response.data.result || { content: [], totalElements: 0, pageable: { pageSize: size } };
  } catch (error) {
    console.error(`Error fetching leave requests for user ${userId}:`, error);
    throw error;
  }
};

// Get leave requests by status with filters
export const getLeaveRequestsByStatus = async (status, page = 0, size = 10, filterParams = {}) => {
  try {
    const params = new URLSearchParams({
      page,
      size,
      sort: 'startDate,desc',
    });

    if (filterParams.startDate) params.append('startDate', filterParams.startDate);
    if (filterParams.endDate) params.append('endDate', filterParams.endDate);
    if (filterParams.searchKeyword) params.append('searchKeyword', filterParams.searchKeyword);
    if (filterParams.leaveType) params.append('leaveType', filterParams.leaveType);

    const response = await axios.get(
      `${API_URL}/api/leave-requests/status/${status}?${params.toString()}`
    );
    return {
      content: response.data.content || [],
      totalElements: response.data.totalElements || 0,
      pageable: response.data.pageable || { pageSize: size },
    };
  } catch (error) {
    console.error(`Error fetching leave requests with status ${status}:`, error);
    throw error;
  }
};

// Update a leave request
export const updateLeaveRequest = async (id, approverId, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/api/leave-requests/${id}/${approverId}`, {
      status: updateData.status,
      approvalComments: updateData.approvalComments || '',
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating leave request with ID ${id}:`, {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

// Delete a leave request
export const deleteLeaveRequest = async (id, userId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/leave-requests/${id}?userId=${userId}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error deleting leave request with ID ${id}:`, error);
    throw error;
  }
};

// Get leave requests of the current user
export const getMyLeaveRequests = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/leave-requests/myLeaveRequests?page=${page}&size=${size}&sort=startDate,desc`
    );
    console.log('Raw API response for myLeaveRequests:', response.data);
    return response.data.result || { content: [], totalElements: 0, pageable: { pageSize: size } };
  } catch (error) {
    console.error('Error fetching my leave requests:', error, 'Response:', error.response?.data);
    throw error;
  }
};

// Get active leave requests for date range
export const getActiveLeaveRequestsForDateRange = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/leave-requests/active?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching active leave requests for date range:', error);
    throw error;
  }
};

// Get pending leave requests for approver
export const getPendingLeaveRequestsForApprover = async (approverId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/leave-requests/pending-approver/${approverId}`
    );
    return response.data.result || [];
  } catch (error) {
    console.error(`Error fetching pending leave requests for approver ${approverId}:`, error);
    throw error;
  }
};

export default {
  createLeaveRequest,
  getLeaveRequestById,
  getAllLeaveRequests,
  getLeaveRequestsByUserId,
  getLeaveRequestsByStatus,
  updateLeaveRequest,
  deleteLeaveRequest,
  getMyLeaveRequests,
  getActiveLeaveRequestsForDateRange,
  getPendingLeaveRequestsForApprover,
};