import axios from 'axios';
import { URL } from '../../helpers/apiRoutes';

const apiClient = axios.create({
  baseURL: URL.api,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('Token_RecSys')}`,
  },
});

export default apiClient;
