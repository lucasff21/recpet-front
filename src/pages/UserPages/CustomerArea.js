import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from "../../components/Layout";
import "../../styles/UserPages.css";
import { loginUser } from "../../services/ApiUser";
import petImage from '../../assets/pet-createaccount.png';
import { toast, ToastContainer } from "react-toastify";
import { AuthContext } from "../../contexts/AuthContext";
import { findByQuestionarioEmail } from "../../services/ConsumeApi";

const CustomerArea = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const userCreated = location.state?.userCreated;

    const { login, role, authToken } = useContext(AuthContext);

    const handleLogin = async () => {
        if (email && password) {
            try {
                const response = await loginUser(email, password);
                const token = response.token;
                login(token);
            } catch (error) {
                console.error("Erro ao realizar login:", error);
            }
        } else {
            console.log("Email ou senha não preenchidos");
        }
    };

    const userQuestionario = async () => {
        try {
            const response = await findByQuestionarioEmail(email, authToken);
            if (response?.user) {
                navigate("/");
            } else {
                navigate("/questionario-adotante");
            }
        } catch (error) {
            console.error("Erro ao verificar questionário:", error);
            toast.error("Erro ao verificar questionário.");
        }
    };

    useEffect(() => {
        const checkQuestionario = async () => {
            if (role?.includes("ADOTANTE") && email && authToken) {
                await userQuestionario();
            }
        };
        checkQuestionario();
    }, [role, authToken]);

    useEffect(() => {
        if (role?.includes("ADMIN")) {
            navigate("/admin-area");
        }
    }, [role, navigate]);



    useEffect(() => {
        if (userCreated) {
            toast.success('Usuário criado com sucesso!', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    }, [userCreated]);

    const acessarCriarContaAdmin = () => {
        navigate("/criar-conta-admin", { state: { role: "ADMIN" } });
    };

    const acessarCriarContaUser = () => {
        navigate("/criar-conta-adotante", { state: { role: "ADOTANTE" } });
    };

    return (
        <Layout showFooter={false}>
            <ToastContainer />

            <>
                <div className="container" id="div-principal-customer">
                    <div className="row">
                        <div className="col-12 card-login-account">
                            <h3>Login</h3>
                            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                                <div className="form-group">
                                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E M A I L: " />

                                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="exampleInputPassword1" placeholder="S E N H A:" />
                                </div>
                                <br />
                                <button type="submit" className="button-customer button-customer-area">Entrar</button>
                            </form>
                            <hr />
                            <p className="text-link">
                                Não tem uma conta? <span onClick={acessarCriarContaAdmin}>Registre-se</span>
                            </p>

                        </div>
                    </div>
                </div>

            </>

        </Layout>
    );
};

export default CustomerArea;
