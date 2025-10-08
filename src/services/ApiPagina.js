import axios from 'axios';
import { URL } from '../helpers/apiRoutes';

export const getPaginaPublicaPorNome = (nome) => {
  return axios({
    url: `${URL.base}/paginas/${nome}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
