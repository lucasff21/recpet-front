import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Importação correta

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => {
        return localStorage.getItem('Token_RecSys'); // Inicializa com o token do localStorage
    });
    const [role, setRole] = useState(null); 

    const isAuthenticated = !!authToken; 

    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem('Token_RecSys', token); 
        tokenDecode(token); 
    };

    const logout = () => {
        setAuthToken(null);
        setRole(null); 
        localStorage.removeItem('Token_RecSys');
    };

    const tokenDecode = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            const userRole = decodedToken.ROLE || null; 
            setRole(userRole); 
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
        }
    };

    useEffect(() => {
        if (authToken) {
            tokenDecode(authToken); 
        }
    }, [authToken]); 

    return (
        <AuthContext.Provider value={{ authToken, isAuthenticated, login, logout, role }}>
            {children}
        </AuthContext.Provider>
    );
};
