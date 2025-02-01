import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Importação correta

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => {
        return localStorage.getItem('Token_RecSys'); // Inicializa com o token do localStorage
    });
    const [role, setRole] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [loading, setLoading] = useState(true);

    const isTokenExpired = (token) => {
        try {
            const decodedToken = jwtDecode(token);
            let expired = decodedToken.exp * 1000 < Date.now();
            return expired;
        } catch { return true; }
    };

    const isAuthenticated =  !isTokenExpired(authToken) && !!authToken;

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
            const userEmailToken = decodedToken.sub || null;
            setUserEmail(userEmailToken)
            setRole(userRole); 
        } catch (error) {
            console.error("Erro ao decodificar o token:", error);
        }
    };

    useEffect(() => {
        if (authToken) {
            if (!isTokenExpired(authToken)) {
                tokenDecode(authToken);
            } else {
                logout();
            }
        }
        setLoading(false);
    }, [authToken]); 

    return (
        <AuthContext.Provider value={{ authToken, isAuthenticated, login, logout, role, userEmail, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
