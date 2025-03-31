import { toast } from 'react-toastify';

export const showToast = (msg, type = "success") => {
    toast(msg, { position: 'top-right', autoClose: 5000, type: type });
};
