// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { jwtDecode } from 'jwt-decode';

function Header({ isAuthenticated, onLogout }) {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // Este efeito será executado sempre que o status de autenticação mudar.
        if (isAuthenticated) {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setUserRole(decodedToken.role);
                } catch (error) {
                    console.error("Erro ao decodificar o token:", error);
                    setUserRole(null);
                }
            }
        } else {
            setUserRole(null);
        }
    }, [isAuthenticated]); // A dependência é o status de autenticação

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
                    eCommerce ADS
                </Typography>

                <IconButton component={Link} to="/cart" color="inherit">
                    <Badge color="secondary">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>

                {/* Renderização condicional do botão de Admin */}
                {isAuthenticated && userRole === 'ADMIN' && (
                    <>
                        <Button color="inherit" component={Link} to="/admin/products">
                            Produtos
                        </Button>
                        <Button color="inherit" component={Link} to="/admin/categories">
                            Categorias
                        </Button>
                    </>
                )}

                {isAuthenticated ? (
                    <Button color="inherit" onClick={onLogout}>Logout</Button>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">Login</Button>
                        <Button color="inherit" component={Link} to="/register">Registrar</Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
}

export default Header;