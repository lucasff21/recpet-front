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
        console.error("Error during login:", error?.response?.data || error.message);
        return null;
    }
}