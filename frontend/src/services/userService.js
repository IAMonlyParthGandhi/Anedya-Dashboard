import axios from 'axios';
import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

const getUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/users`, getAuthHeaders());
  return response.data;
};

const createUser = async (data) => {
  const payload = {
    email: data.email,
    password: data.password,
    first_name: data.firstName,
    last_name: data.lastName,
    roleId: data.roleId
  };
  const response = await axios.post(`${API_BASE_URL}/users`, payload, getAuthHeaders());
  return response.data;
};

const updateUser = async (id, data) => {
  const payload = {
    first_name: data.firstName,
    last_name: data.lastName,
    role_id: data.roleId,
    is_active: data.isActive
  };
  const response = await axios.put(`${API_BASE_URL}/users/${id}`, payload, getAuthHeaders());
  return response.data;
};

const deactivateUser = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/users/${id}`, getAuthHeaders());
  return response.data;
};

const getRoles = async () => {
  const response = await axios.get(`${API_BASE_URL}/roles`, getAuthHeaders());
  return response.data;
};

export const userService = {
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
  getRoles
};
