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
                login(response.data);
            } catch (error) {
                toast("Erro ao realizar login", {
                    type: 'error',
                    position: 'bottom-right',
                    autoClose: 5000,
                })
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
        <Layout>
            <ToastContainer />
            <div className="container" id="div-principal-customer">
                <div className="row">
                    <div className="col card-creat-account">
                        <h3>Bem Vindo</h3>
                        <img src={petImage} alt="Logo" className="img-pet" />
                        <p className="text-creat-account">Junte-se a nós na missão de proporcionar um lar amoroso para todos os pets.
                            Faça a diferença hoje e conheça nosso Pets</p>
                        <button type="submit" className="button-customer" onClick={acessarCriarContaAdmin}>Criar Conta</button>
                        <br />
                        <button type="submit" className="button-customer" onClick={acessarCriarContaUser}>Criar Conta Usuario Comum</button>
                    </div>
                    <div className="col card-login-account">
                        <h3>Login</h3>
                        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                            <div className="form-group">
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E M A I L: " />

                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} id="exampleInputPassword1" placeholder="S E N H A:" />
                            </div>
                            <button type="submit" className="button-customer button-customer-area">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CustomerArea;
