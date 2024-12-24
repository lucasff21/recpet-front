import axios from 'axios';

export const getAdressByZipCode = async (cep) => {
    return axios({
        url: `https://viacep.com.br/ws/${cep}/json`,
        headers: {
            'Content-Type': 'application/json',
        }
    })
}