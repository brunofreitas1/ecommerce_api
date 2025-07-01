import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        // Se não há token, redireciona para o login
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);
        // CORREÇÃO: Verificamos se o cargo é 'ADMIN'.
        // O nosso backend foi configurado para colocar 'USER' ou 'ADMIN' no token.
        if (decodedToken.exp * 1000 < Date.now() || decodedToken.role !== 'ADMIN') {
            // Se o token estiver expirado ou o cargo não for ADMIN, redireciona para a página inicial.
            console.log("Acesso negado. Cargo do utilizador:", decodedToken.role); // Linha de debug
            return <Navigate to="/" />;
        }
    } catch (error) {
        console.error("Token inválido:", error);
        return <Navigate to="/login" />;
    }

    // Se tudo estiver certo, renderiza a página de administração solicitada.
    return children;
};

export default ProtectedRoute;