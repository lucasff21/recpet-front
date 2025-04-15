import axios from 'axios';
import { BASE_API_URL } from '../helpers/apiRoutes'

const apiUrl = BASE_API_URL.url

export const cachorroFindAll = async () => {
    return await axios.get(`${apiUrl}/api/cachorro/findall`);
}

export const createCachorro = (cachorroData, token) => {
    return axios.post(`${apiUrl}/api/cachorro/create`, cachorroData, {
        headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
        }
    });
};


export const createQuestionario = async (questinarioData, token) => {
    try {
        const url = `${apiUrl}/api/questionario`;
        const response = await axios.post(url, questinarioData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data
    } catch (error) {
        console.error("Error post:", error?.response?.data || error.message);
        return null;
    }
}

export const findByQuestionarioEmail = async (email, token) => {
    try {
        const url = `${apiUrl}/api/questionario/email/${email}`
        const response = await axios({
            url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data;
    } catch (error) {
        console.error("Error: ", error?.response?.data || error.message);
        return null;
    }
}

export const findByIdCachorro = async (id) => {
    const url = `${apiUrl}/api/cachorro/${id}`
    const response = await axios({
        url,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    return response.data;
}

export const adotarPet = (data, token) => {
    return axios.post(`${apiUrl}/api/adocao`, data, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
}

export const findAllAdocoes = (token) => {
    return axios.get(`${apiUrl}/api/adocao`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
};

