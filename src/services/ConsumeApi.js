import axios from 'axios';
import { BASE_API_URL } from '../helpers/apiRoutes'

const apiUrl = BASE_API_URL.baseUrl

export const CachorroFindAll = async () => {
    try {
        const url = `${apiUrl}/api/cachorro`
        const response = await axios.get(url);
        return response.data;
    } catch (error) { 
        console.error("Error get List:", error?.response?.data || error.message);
        return null;
    }
}

export const createCachorro = async (cachorroData, token) => {
    console.log('Token:', token); 
    try {
        const url = `${apiUrl}/api/cachorro`;
        const response = await axios.post(url, cachorroData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) { 
        console.error("Error post:", error?.response?.data || error.message);
        return null;
    }
};


// QUESTIONARIO

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