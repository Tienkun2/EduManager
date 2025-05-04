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

// Lấy danh sách tất cả phòng ban
export const getAllDepartments = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/departments`);
    return response.data.result || [];
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};

// Lấy thông tin chi tiết phòng ban
export const getDepartmentById = async (departmentId) => {
  try {
    const response = await axios.get(`${API_URL}/api/departments/${departmentId}`);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching department with ID ${departmentId}:`, error);
    throw error;
  }
};

// Thêm phòng ban mới
export const createDepartment = async (departmentData) => {
  try {
    const response = await axios.post(`${API_URL}/api/departments`, departmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating department:', error);
    throw error;
  }
};

// Cập nhật phòng ban
export const updateDepartment = async (departmentId, departmentData) => {
  try {
    const response = await axios.put(`${API_URL}/api/department/${departmentId}`, departmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating department with ID ${departmentId}:`, error);
    throw error;
  }
};

// Xóa phòng ban
export const deleteDepartment = async (departmentId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/department/${departmentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting department with ID ${departmentId}:`, error);
    throw error;
  }
};

// Flatten department hierarchy for dropdown
export const flattenDepartments = (departments) => {
  let flatDepartments = [];
  
  const flatten = (deps, level = 0) => {
    deps.forEach(dep => {
      flatDepartments.push({
        id: dep.id,
        name: dep.name,
        label: '  '.repeat(level) + dep.name, // Add indentation for visualization
        description: dep.description, // Thêm trường description
        parentName: dep.parentName
      });
      
      if (dep.children && dep.children.length > 0) {
        flatten(dep.children, level + 1);
      }
    });
  };
  
  flatten(departments);
  return flatDepartments;
};