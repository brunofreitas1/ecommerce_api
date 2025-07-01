// Versão completa e correta do src/App.js

import React, { useState, useCallback } from 'react'; // Importe o useCallback
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Container, Snackbar, Alert } from '@mui/material';
import authService from './services/authService';

// Importe todos os seus componentes...
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartPage from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import ProductManager from './components/ProductManager';
import CategoryManager from './components/CategoryManager';
import ProductDetailPage from './components/ProductDetailPage';
import OrderHistory from './components/OrderHistory';

function AppContent() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleLoginSuccess = () => setIsAuthenticated(true);
    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        navigate('/login');
    };

    // Usamos useCallback para garantir que esta função não cause loops de renderização
    const showSnackbar = useCallback((message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <Container sx={{ mt: 4, mb: 4 }}>
                <Routes>
                    <Route path="/" element={<ProductList showSnackbar={showSnackbar} />} />
                    <Route path="/products/:id" element={<ProductDetailPage showSnackbar={showSnackbar} />} />
                    <Route path="/cart" element={<CartPage showSnackbar={showSnackbar} />} />
                    <Route path="/order-history" element={<ProtectedRoute><OrderHistory showSnackbar={showSnackbar} /></ProtectedRoute>} />
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/admin/products" element={<ProtectedRoute><ProductManager showSnackbar={showSnackbar} /></ProtectedRoute>} />
                    <Route path="/admin/categories" element={<ProtectedRoute><CategoryManager showSnackbar={showSnackbar} /></ProtectedRoute>} />
                </Routes>
            </Container>

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