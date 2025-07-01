import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// O componente agora aceita uma propriedade 'adminOnly'
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');

    // 1. Se não há token, o usuário não está logado. Redireciona para o login.
    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decodedToken = jwtDecode(token);

        // 2. Verifica se o token expirou
        if (decodedToken.exp * 1000 < Date.now()) {
            // Token expirado, remove e redireciona para o login
            localStorage.removeItem('token');
            return <Navigate to="/login" />;
        }

        // 3. Se a rota é SÓ para admin, verifica o cargo.
        if (adminOnly && decodedToken.role !== 'ADMIN') {
            // Se não for admin, redireciona para a página inicial
            return <Navigate to="/" />;
        }
    } catch (error) {
        // Se o token for inválido, limpa e redireciona para o login
        localStorage.removeItem('token');
        console.error("Token inválido ou expirado:", error);
        return <Navigate to="/login" />;
    }

    // 4. Se todas as verificações passaram, renderiza o componente filho.
    return children;
};

export default ProtectedRoute;