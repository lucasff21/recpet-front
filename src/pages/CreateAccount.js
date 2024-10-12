import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Layout from "../components/Layout";
import "../styles/CustomerArea.css";
import { createUser } from "../services/ApiUser";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateAccount = () => {
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState(''); // Estado para e-mail de confirmação
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const createAccount = async () => {
        if (email && password && email === confirmEmail) { // Verifica se os e-mails correspondem
            try {
                await createUser(email, password, 'ADMIN');

                navigate("/area-cliente", { state: { userCreated: true } });
             
            } catch (error) {
                console.error("Erro ao criar conta:", error);
            }
        } else if (email !== confirmEmail) {
            toast.error("Os e-mails não coincidem!", {
                position: 'bottom-right',
                autoClose: 5000,
            });
        } else {
            console.log("Email ou senha não preenchidos");
        }
    }

    return (
        <Layout showFooter={false}>
            <form onSubmit={(e) => { e.preventDefault(); createAccount(); }}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        aria-describedby="emailHelp"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmEmail" className="form-label">Confirm Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="confirmEmail"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Criar Conta
                </button>
            </form>
            <ToastContainer />
        </Layout>
    );
}

export default CreateAccount;