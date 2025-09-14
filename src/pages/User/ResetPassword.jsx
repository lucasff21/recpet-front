import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sendNewPassword } from "../../services/ApiUser";
import { resetPassword } from "../../zod/ResetPassword";

const ResetPassword = () => {
  const [senha, setSenha] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tokenReset = searchParams.get("token");

  const requestPassword = async () => {
    const result = resetPassword.safeParse({
      password: senha,
      confirmPassword: confirmPassword,
    });

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0]] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    if (!tokenReset) {
      return toast.error("Token inválido ou ausente.");
    }

    const formData = new FormData();
    formData.append("password", senha);
    formData.append("tokenReset", tokenReset);

    setLoading(true);
    try {
      await sendNewPassword(formData);
      toast.success("Senha alterada com sucesso!");
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      toast.error("Erro ao solicitar recuperação de senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Alterar Senha!
        </h1>

        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            requestPassword();
          }}
        >
          <label>Digitar senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            onChange={(e) => setSenha(e.target.value)}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

          <label>Confirmar senha</label>
          <input
            type="password"
            placeholder="Confirme sua senha"
            className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
            }`}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`bg-gray-900 text-white py-2 rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
