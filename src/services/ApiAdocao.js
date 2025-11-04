import apiClient from './api/axios';
import axios from 'axios';
import { URL } from '../helpers/apiRoutes';

export const findAllAnimals = async (params = {}) => {
  return axios.get(`${URL.api}/animais`, { params });
};

export const findAllCaracteristicas = () => {
  return axios.get(`${URL.api}/animais/caracteristicas`);
};

export const createAnimal = (animal) => {
  return apiClient.post('/animais', animal, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const createQuestionario = async (questinarioData, token) => {
  try {
    const response = await apiClient.post('/questionario', questinarioData);
    return response.data;
  } catch (error) {
    console.error('Error post:', error?.response?.data || error.message);
    return null;
  }
};

export const findByQuestionarioEmail = async (email, token) => {
  try {
    const response = await apiClient.get(`questionario/email/${email}`);
    return response.data;
  } catch (error) {
    console.error('Error: ', error?.response?.data || error.message);
    return null;
  }
};

export const findAnimalById = async (id) => {
  return axios.get(`${URL.api}/animais/${id}`);
};

export const adotarPet = (data) => {
  return apiClient.post('/adocao', data);
};

export const findAllAdocoes = () => {
  return apiClient.get(`/adocao`);
};

export const updateAnimal = (id, data) => {
  return apiClient.put(`/animais/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deletarAdocao = (id) => {
  return apiClient.put(`/adocao/${id}`);
};
