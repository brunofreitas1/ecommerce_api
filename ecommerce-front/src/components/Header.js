import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// O Header agora recebe o status de autenticação e a função de logout como props
function Header({ isAuthenticated, onLogout }) {
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