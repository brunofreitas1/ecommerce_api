import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { jwtDecode } from 'jwt-decode';
import { useCart } from '../context/CartContext'; // A importação agora é válida!

function Header({ isAuthenticated, onLogout }) {
    const { cart } = useCart(); // Hook para acessar os dados do carrinho
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    // Calcula a quantidade de itens no carrinho
    const cartItemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
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
    }, [isAuthenticated]);

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
                    eCommerce ADS
                </Typography>

                <IconButton component={Link} to="/cart" color="inherit">
                    <Badge badgeContent={cartItemCount} color="error">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>

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
                    <>
                        <Button color="inherit" component={Link} to="/order-history">
                            Meus Pedidos
                        </Button>
                        <Button color="inherit" onClick={handleLogoutClick}>Logout</Button>
                    </>
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