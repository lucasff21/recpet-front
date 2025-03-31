import { useContext, useEffect, useState } from "react";
import {Link, useLocation, useNavigate} from 'react-router-dom';
import Layout from "../../components/Layout";
import "../../styles/UserPages.css";
import { loginUser } from "../../services/ApiUser";
import { AuthContext } from "../../contexts/AuthContext";
import { findByQuestionarioEmail } from "../../services/AuthApi";
import { showToast } from "../../utils/toast";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const userCreated = location.state?.userCreated;

    const { login, role, authToken } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault()

        if (email && password) {
            loginUser(email, password)
                .then((response) => {
                    login(response.data);
                })
                .catch(() =>  showToast("Erro ao realizar login",  'error'))
        } else {
            showToast("Email ou senha não preenchidos",  'error')
        }
    };

    const userQuestionario = async () => {
        try {
            const response = await findByQuestionarioEmail(email, authToken);
            if (response?.user) {
                navigate("/");
            } else {
                navigate("/questionario");
            }
        } catch (error) {
            showToast("Erro ao verificar questionário.", 'error');
        }
    };

    useEffect(() => {
        if (role?.includes("ADOTANTE") && email && authToken) {
           return userQuestionario();
        }
    }, [role, authToken]);

    useEffect(() => {
        if (role?.includes("ADMIN")) {
            navigate("/admin");
        }
    }, [role, navigate]);


    useEffect(() => {
        if (userCreated) {
            showToast('Usuário criado com sucesso!')
        }
    }, [userCreated]);

    return (
        <Layout>
            <div className="my-16 md:w-[380px]">
                <div className="space-y-8 bg-white p-8 rounded-lg shadow-md border border-gray-200">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Login</h2>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    E-mail
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                    placeholder="Sua senha"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="bg-cyan-950 hover:bg-cyan-900 border-transparent px-4 py-2 rounded-md text-sm text-white transition-colors w-full"
                            >
                                Entrar
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center justify-center mt-3">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Esqueceu a senha?
                            </a>
                        </div>
                    </div>

                    <div className="text-center text-sm mt-3">
                        <span className="text-gray-600">Não tem uma conta? </span>
                        <Link to="/criar-conta" className="font-medium text-blue-600 hover:text-blue-500">
                            Registre-se
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
