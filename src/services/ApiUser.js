import axios from 'axios';
import { URL } from '../helpers/apiRoutes';
import apiClient from './api/axios';

const apiUrl = URL.base;

console.log(apiUrl)

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

export const findByUserEmail = async (email, token) => {
  try {
    const url = `${apiUrl}/users/findbyemail/${email}`;
    const response = await axios({
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error: ', error?.response?.data || error.message);
    return null;
  }
};

export const updateUserProfile = async (data) => {
  return apiClient.put(`${apiUrl}/users/me`, data);
};

export const sendEMailResetPassword = async (formData) => {
  const url = `${apiUrl}/users/password-reset/request`;
  const response = await axios.post(url, formData);
  return response;
}

export const sendNewPassword = async (formData) => {
  const url = `${apiUrl}/users/new-password`;
  const response = await axios.put(url, formData);
  return response;
};
