import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Container, Snackbar, Alert } from '@mui/material';
import authService from './services/authService';

// Componentes
import Header from './components/Header';
import ProductList from './components/ProductList';
import CartPage from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';

function AppContent() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        navigate('/login');
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
            <Container sx={{ mt: 4 }}>
                <Routes>
                    <Route path="/" element={<ProductList showSnackbar={showSnackbar} />} />
                    <Route path="/cart" element={<CartPage showSnackbar={showSnackbar} />} />
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
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