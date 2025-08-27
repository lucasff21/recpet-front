import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { sendEMailResetPassword } from "../../services/ApiUser";


const RequestRecoveryPassword = () => {
    const [email, setEmail] = useState<string>('')
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const requestPassword = async () => {
        const isEmailValid = (email: string) =>
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!isEmailValid(email)) {
            return toast.error("Digite um e-mail válido.");
        }

        const formData = new FormData();
        formData.append('email', email)

        setLoading(true);
        try {
            await sendEMailResetPassword(formData);
            toast.success("Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.");

            setTimeout(() => navigate("/"), 500);


        } catch (err) {
            toast.error("Erro ao solicitar recuperação de senha.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
                    Recuperar Senha
                </h1>

                <form className="flex flex-col space-y-4" onSubmit={(e) => { e.preventDefault(); requestPassword() }}>
                    <input
                        type="email"
                        placeholder="Digite seu e-mail"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-gray-900 text-white py-2 rounded-md transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                    >
                        {loading ? "Enviando..." : "Enviar"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default RequestRecoveryPassword;
