import apiClient from './api/axios';
import { URL } from '../helpers/apiRoutes';

const apiUrl = URL.base;

export const findAllCaracteristicas = (params = {}) => {
  return apiClient.get(`${apiUrl}/admin/caracteristicas`, { params });
};

export const createCaracteristica = (data) => {
  return apiClient.post(`${apiUrl}/admin/caracteristicas`, data);
};

export const updateCaracteristica = (id, data) => {
  return apiClient.put(`${apiUrl}/admin/caracteristicas/${id}`, data);
};

export const deactivateCaracteristica = (id) => {
  return apiClient.put(`${apiUrl}/admin/caracteristicas/${id}/desativar`);
};

export const reactivateCaracteristica = (id) => {
  return apiClient.put(`${apiUrl}/admin/caracteristicas/${id}/reativar`);
};
