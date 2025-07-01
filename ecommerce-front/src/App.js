import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Container, Snackbar, Alert, CssBaseline } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

// Componentes
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetailPage from './components/ProductDetailPage';
import Cart from './components/CartPage';
import Login from './components/Login';
import Register from './components/Register';
import OrderHistory from './components/OrderHistory';
import ProductManager from './components/ProductManager';
import CategoryManager from './components/CategoryManager';
import ProtectedRoute from './components/ProtectedRoute';

// Serviços
import authService from './services/authService';

// Lógica de autenticação e UI
function AppContent() {
    const navigate = useNavigate();
    // Estado para autenticação
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

    // Estado para o Snackbar (notificações)
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Função para mostrar o snackbar
    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    // Função para fechar o snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    // Funções de login e logout
    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        // Não é mais necessário decodificar o token aqui, o Header e ProtectedRoute já fazem isso.
    };

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        navigate('/login'); // Redireciona para o login após o logout
    };

    // Verifica se o token ainda é válido ao carregar o app
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    handleLogout(); // Se o token expirou, faz o logout
                }
            } catch (e) {
                handleLogout(); // Se o token for inválido, faz o logout
            }
        }
    }, []);

    return (
        <>
            <CssBaseline />
            <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <Container sx={{ mt: 4, mb: 4 }}>
                <Routes>
                    {/* Rotas Públicas */}
                    <Route path="/" element={<ProductList showSnackbar={showSnackbar} />} />
                    <Route path="/products/:id" element={<ProductDetailPage showSnackbar={showSnackbar} />} />
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/register" element={<Register showSnackbar={showSnackbar} />} />

                    {/* Rotas Protegidas para Usuários Logados */}
                    <Route path="/cart" element={<ProtectedRoute><Cart showSnackbar={showSnackbar} /></ProtectedRoute>} />
                    <Route path="/order-history" element={<ProtectedRoute><OrderHistory showSnackbar={showSnackbar} /></ProtectedRoute>} />

                    {/* Rotas Protegidas apenas para ADMIN */}
                    <Route path="/admin/products" element={<ProtectedRoute adminOnly={true}><ProductManager showSnackbar={showSnackbar} /></ProtectedRoute>} />
                    <Route path="/admin/categories" element={<ProtectedRoute adminOnly={true}><CategoryManager showSnackbar={showSnackbar} /></ProtectedRoute>} />
                </Routes>
            </Container>

            {/* Componente Snackbar para notificações */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}


function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;