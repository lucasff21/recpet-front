import axios from 'axios';
import { BASE_API_URL } from '../helpers/apiRoutes'

const apiUrl = BASE_API_URL.baseUrl

export const createUser = async (data) => {
    return axios({
        url: `${apiUrl}/admin/create`,
        method: 'POST',
        data:  data,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("Token_RecSys")}`
        },
    })
}

export const deleteUser = async (id) => {
    return axios({
        url: `${apiUrl}/admin/delete-user/${id}`,
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("Token_RecSys")}`
        },
    })
}