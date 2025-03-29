import axios from 'axios';
import { BASE_API_URL } from '../helpers/apiRoutes'


const apiUrl = BASE_API_URL.baseUrl

export const loginUser = async (email, password) => {
        return axios({
            url: `${apiUrl}/users/login`,
            method: 'POST',
            data:  { email, password },
            headers: {
                'Content-Type': 'application/json',
            },
        })
}


export const createUser = async (payload) => {
        return axios({
            url: `${apiUrl}/users/create`,
            method: 'POST',
            data: payload,
            headers: {
                'Content-Type': 'application/json',
            }
        })
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