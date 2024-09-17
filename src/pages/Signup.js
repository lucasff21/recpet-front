import { useState } from "react";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = () => {
        if (password !== confirmPassword) {
            console.log('Senhas não conferem!');
            return;
        }
        // Lógica para criar uma conta (integração com a API)
        console.log(`Criando conta com email: ${email}`);
    };

    return (
        <div>
            <h2>Criação de Conta</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Senha: </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label>Confirmar Senha: </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Criar Conta</button>
            </form>
        </div>
    );
};

export default Signup;