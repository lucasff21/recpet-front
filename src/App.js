import React from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./contexts/AuthContext"; // Importa o AuthProvider

const App = () => (
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
);

export default App;
