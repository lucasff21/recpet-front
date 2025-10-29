import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { sendEMailResetPassword } from '../../services/ApiUser';
import { showToast } from '../../utils/toast';

const RecoveryPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const requestPassword = async () => {
    const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isEmailValid(email)) {
      return toast.error('Digite um e-mail válido.');
    }

    setLoading(true);

    sendEMailResetPassword({ email })
      .then(() => {
        showToast(
          'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.'
        );
        setTimeout(() => navigate('/'), 500);
      })
      .catch(() => {
        showToast('Erro ao solicitar recuperação de senha.', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Recuperar Senha
        </h1>

        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            requestPassword();
          }}
        >
          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-gray-900 text-white py-2 rounded-md transition ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecoveryPassword;
