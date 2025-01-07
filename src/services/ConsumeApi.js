import axios from 'axios';
import { BASE_API_URL } from '../helpers/apiRoutes'

const apiUrl = BASE_API_URL.baseUrl

export const CachorroFindAll = async () => {
    try {
        const url = `${apiUrl}/api/cachorro/findall`
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
        const url = `${apiUrl}/api/cachorro/create`;
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


export const uploadImagePet = async (formData, token) => {
    try {
        const url = `${apiUrl}/api/cachorro/upload-image`
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data; // Retorna a resposta para ser tratada no front-end
    }
    catch (error) {
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


export const downloadImage = async(filePath) => {
    try {
        const url = `${apiUrl}/api/cachorro/download-image?fileName=${encodeURIComponent(filePath)}`;
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'blob', 
        })
        
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        return URL.createObjectURL(blob); 

    } catch (error) {
        console.error("Error: ", error?.response?.data || error.message);
        return null;
    }
}


export const adotarPet = async(data, token) => {

    console.log(token)

    console.log(data)
   
        const url = `${apiUrl}/api/adocao`;
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data
   
}