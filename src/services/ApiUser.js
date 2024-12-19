import axios from 'axios';
import { BASE_API_URL } from '../helpers/apiRoutes'


const apiUrl = BASE_API_URL.baseUrl

export const loginUser = async (email, password) => {
    try {
        const payload = { email, password }
        const url = `${apiUrl}/users/login`
        const response = await axios({
            url,
            method: 'POST',
            data: payload,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        return response.data;
    } catch (error) {
        console.error("Error :", error?.response?.data || error.message);
        return null;
    }
}


export const createUser = async (email, password, tipoUsuario) => {
    try {
        const payload = { email, password, tipoUsuario }
        const url = `${apiUrl}/users/create`
        const response = await axios({
            url,
            method: 'POST',
            data: payload,
            headers: {
                'Content-Type': 'application/json',
            }
        })

        return response.data;
    } catch (error) {
        console.error("Error: ", error?.response?.data || error.message);
        return null;
    }
}


export const findByUserEmail = async (email, token) => {
    try {
        const url = `${apiUrl}/users/findbyemail/${email}`
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

export const findbyUserId = async (id, token) => {
    try {
        const url = `${apiUrl}/users/${id}`
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