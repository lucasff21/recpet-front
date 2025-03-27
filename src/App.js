import React from "react";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import './index.css';

const App = () => (
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
);

export default App;
