import axios from 'axios';
import { URL } from '../helpers/apiRoutes';
import apiClient from './api/axios';

const apiUrl = URL.base;

export const loginUser = async (email, password) => {
  return axios({
    url: `${apiUrl}/users/login`,
    method: 'POST',
    data: { email, password },
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const createUser = async (payload) => {
  return axios({
    url: `${apiUrl}/users/create`,
    method: 'POST',
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateUserProfile = async (data) => {
  return apiClient.put(`${apiUrl}/users/me`, data);
};

export const sendEMailResetPassword = async (params) => {
  return axios.post(`${apiUrl}/users/password-reset`, params);
};

export const sendNewPassword = async (params) => {
  return axios.put(`${apiUrl}/users/new-password`, params);
};
