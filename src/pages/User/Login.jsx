import { useContext, useEffect, useState } from "react";
import {Link, useLocation, useNavigate} from 'react-router-dom';
import Layout from "../../components/Layout";
import "../../styles/UserPages.css";
import { loginUser } from "../../services/ApiUser";
import { AuthContext } from "../../contexts/AuthContext";
import { findByQuestionarioEmail } from "../../services/ApiAdocao";
import { showToast } from "../../utils/toast";
import InputField from "../../components/FormFields/InputField";

const Login = () => {
    const [email, setEmail] = useState('');
    const [erroEmail, setErroEmail] = useState("");
    const [erroPassword, setErroPassword] = useState("");
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userCreated = location.state?.userCreated;

    const { login, role, authToken } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault()

        if (email.length > 10 && password.length) {
            setLoading(true);
            loginUser(email, password)
                .then((response) => {
                    login(response.data);
                })
                .catch(() =>  showToast("Erro ao realizar login",  'error'))
                .finally(() => {
                    setLoading(false);
                });
        } else {
            showToast("Email ou senha não preenchidos",  'error')
            if (!email.length) {
                setErroEmail('Campo obrigatório');
            }

            if (!password.length) {
                setErroPassword('Campo obrigatório');
            }
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
                            <button
                                type="submit"
                                className="bg-cyan-950 hover:bg-cyan-900 border-transparent px-4 py-2 rounded-md text-sm text-white transition-colors w-full"
                                disabled={loading}
                            >
                                Entrar
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center justify-center mt-3">
                        <div className="text-sm">
                            <Link to="#"
                                  className="font-medium text-blue-600 hover:text-blue-500"
                                  disabled={loading}
                            >
                                Esqueceu a senha?
                            </Link>
                        </div>
                    </div>

                    <div className="text-center text-sm mt-3">
                        <span className="text-gray-600">Não tem uma conta? </span>
                        <Link to="/criar-conta"
                              className="font-medium text-blue-600 hover:text-blue-500"
                                disabled={!loading}
                        >
                            Registre-se
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Login;
