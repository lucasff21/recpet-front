import apiClient from './api/axios';
import axios from 'axios';
import { URL } from '../helpers/apiRoutes';

export const findAllAnimals = async (params = {}) => {
  return await axios.get(`${URL.api}/cachorro/findall`, { params });
};

export const createAnimal = (cachorroData) => {
  return apiClient.post('/cachorro/create', cachorroData, {
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
  return apiClient.get(`/cachorro/${id}`);
};

export const adotarPet = (data) => {
  return apiClient.post('/adocao/create', data);
};

export const findAllAdocoes = () => {
  return apiClient.get(`/adocao`);
};

export const updateAnimal = (id, data) => {
  return apiClient.put(`/cachorro/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const findAllCaracteristicas = () => {
  return apiClient.get('/cachorro/caracteristicas');
};
