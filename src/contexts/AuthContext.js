import { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    return localStorage.getItem('Token_RecSys');
  });
  const [role, setRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem('User_RecSys'));
  });

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  const isAuthenticated = !isTokenExpired(authToken) && !!authToken;
  const isAdmin = isAuthenticated && role === 'ADMIN';

  const login = (data) => {
    setAuthToken(data.token);
    setUser(data.user);
    setRole(data.user.tipoUsuario);
    localStorage.setItem('Token_RecSys', data.token);
    tokenDecode(data.token);
    localStorage.setItem('User_RecSys', JSON.stringify(data.user));
  };

  const logout = () => {
    setAuthToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem('Token_RecSys');
    localStorage.removeItem('User_RecSys');
  };

  const updateUserContext = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('User_RecSys', JSON.stringify(updatedUserData));
  };

  const tokenDecode = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.ROLE || null;
      const userEmailToken = decodedToken.sub || null;
      setUserEmail(userEmailToken);
      setRole(userRole);
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
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
    <AuthContext.Provider
      value={{
        authToken,
        isAuthenticated,
        login,
        logout,
        role,
        userEmail,
        loading,
        user,
        isAdmin,
        updateUserContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
