import { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import '../../styles/UserPages.css';
import { loginUser } from '../../services/ApiUser';
import { AuthContext } from '../../contexts/AuthContext';
import { showToast } from '../../utils/toast';
import InputField from '../../components/FormFields/InputField';
import { Button } from '../../components/Button';
import Modal from '../../components/Modal';
import QuestionarioForm from '../../components/QuestionarioForm';

const Login = () => {
  const [email, setEmail] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [erroPassword, setErroPassword] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userCreated = location.state?.userCreated;

  const { login } = useContext(AuthContext);

  const [isQuestionarioModalOpen, setIsQuestionarioModalOpen] = useState(false);

  const getRedirectPath = () => {
    try {
      const searchParams = new URLSearchParams(location.search);
      const redirectParam = searchParams.get('redirect');

      if (redirectParam) {
        const decodedPath = decodeURIComponent(redirectParam);
        if (
          decodedPath.startsWith('/') &&
          !decodedPath.includes('//') &&
          !decodedPath.includes(':')
        ) {
          return decodedPath;
        }
      }
    } catch (error) {
      showToast('Erro ao processar redirect.', 'error');
    }
    return null;
  };

  const handleModalClose = () => {
    setIsQuestionarioModalOpen(false);
    navigate('/');
  };

  const handleQuestionarioSuccess = () => {
    setIsQuestionarioModalOpen(false);
    navigate('/');
  };

  const handlePostLogin = (userData) => {
    const redirect = getRedirectPath();

    if (redirect) {
      return navigate(redirect);
    }

    if (userData.tipoUsuario === 'ADMIN') {
      return navigate('/admin/dashboard');
    }

    if (!userData.questionario) {
      return setIsQuestionarioModalOpen(true);
    }

    navigate('/');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.length || !password.length) {
      showToast('Email ou senha não preenchidos', 'error');
      setErroEmail(!email.length ? 'Campo obrigatório' : '');
      setErroPassword(!password.length ? 'Campo obrigatório' : '');
      return;
    }

    setLoading(true);
    loginUser(email, password)
      .then(({ data }) => {
        login(data);
        setTimeout(() => {
          handlePostLogin(data.user);
        }, 100);
      })
      .catch((r) => {
        showToast('E-mail ou senha inválidos', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (userCreated) {
      showToast('Usuário criado com sucesso!');
    }
  }, [userCreated]);

  return (
    <Layout>
      <div className="align-content-center flex justify-center my-16">
        <div className="space-y-8 bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Login</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <InputField
                type="email"
                autoComplete="email"
                label="E-mail"
                placeholder="Seu e-mail"
                value={email}
                errors={erroEmail}
                onChange={(e) => setEmail(e.target.value)}
              />
              <InputField
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Sua senha"
                label="Senha"
                value={password}
                errors={erroPassword}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <Button
                className="bg-cyan-950 hover:bg-cyan-900 border-transparent px-4 py-2 rounded-md text-sm text-white transition-colors w-full"
                disabled={loading}
                loading={loading}
                onClick={handleLogin}
                confirm={true}
              >
                Entrar
              </Button>
            </div>
          </form>

          <div className="flex items-center justify-center mt-3">
            <div className="text-sm">
              <Link
                to="/solicitar-senha"
                className="font-medium text-blue-600 hover:text-blue-500"
                disabled={loading}
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>

          <div className="text-center text-sm mt-3">
            <span className="text-gray-600">Não tem uma conta? </span>
            <Link
              to="/criar-conta"
              className="font-medium text-blue-600 hover:text-blue-500"
              disabled={!loading}
            >
              Registre-se
            </Link>
          </div>
        </div>
      </div>

      {isQuestionarioModalOpen && (
        <Modal onClose={handleModalClose} title="Questionário de Adoção">
          <QuestionarioForm
            onSuccess={handleQuestionarioSuccess}
            onClose={handleModalClose}
            showTitle={false}
          />
        </Modal>
      )}
    </Layout>
  );
};

export default Login;
