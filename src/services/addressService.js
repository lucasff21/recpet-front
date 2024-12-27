import axios from 'axios';

const getAddressByZipCode = async (cep) => {
    return axios({
        url: `https://viacep.com.br/ws/${cep}/json`,
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

const getAllStates = async () => {
   return axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados/")
}

const getCitiesFromState = async (uf) => {
    return axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
}

export {
    getAddressByZipCode,
    getAllStates,
    getCitiesFromState
}