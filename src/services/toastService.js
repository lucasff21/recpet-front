import { toast } from 'react-toastify';

export const showToast = (msg, type = "success") => {
    toast(msg, { position: 'bottom-right', autoClose: 5000, type: type });
};
