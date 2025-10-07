import axios from 'axios';
import { URL } from '../helpers/apiRoutes';
import apiClient from './api/axios';

const apiUrl = URL.base;

export const createUser = async (data) => {
  return axios({
    url: `${apiUrl}/admin/create`,
    method: 'POST',
    data: data,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('Token_RecSys')}`,
    },
  });
};

export const deleteUser = async (id) => {
  return axios({
    url: `${apiUrl}/admin/user/${id}`,
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('Token_RecSys')}`,
    },
  });
};

export const getUsers = (params) => {
  return axios({
    url: `${apiUrl}/admin/users`,
    method: 'GET',
    params: params,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('Token_RecSys')}`,
    },
  });
};

export const updateRole = async (id, data) => {
  return axios({
    url: `${apiUrl}/admin/role/${id}`,
    method: 'PATCH',
    data: data,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('Token_RecSys')}`,
    },
  });
};

export const getAllAdoptions = (params) => {
  return axios({
    url: `${apiUrl}/admin/adocoes`,
    method: 'GET',
    params: params,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('Token_RecSys')}`,
    },
  });
};

export const updateAdoptionStatus = async (id, data) => {
  return axios({
    url: `${apiUrl}/admin/adocoes/${id}`,
    method: 'PATCH',
    data: data,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('Token_RecSys')}`,
    },
  });
};

export const findAllAnimals = async (params = {}) => {
  return await apiClient.get(`${apiUrl}/admin/animais`, { params });
};

export const getAdocoesByAnimalId = async (id, params = {}) => {
  return await apiClient.get(`${apiUrl}/admin/animais/${id}/adocoes`, {
    params,
  });
};
