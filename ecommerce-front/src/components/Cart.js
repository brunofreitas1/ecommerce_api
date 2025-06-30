import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress
} from '@mui/material';
import api from '../api';

function CartPage({ showSnackbar }) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = async () => {
        try {
            const response = await api.get('/api/cart');
            setCart(response.data);
        } catch (error) {
            console.error("Erro ao buscar o carrinho:", error);
            showSnackbar('Você precisa estar logado para ver o carrinho.', 'error');
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleCheckout = async () => {
        try {
            await api.post('/api/cart/checkout');
            fetchCart();
            showSnackbar('Compra finalizada com sucesso!', 'success');
        } catch (error) {
            console.error("Erro ao finalizar a compra:", error);
            showSnackbar('Erro ao finalizar a compra. Verifique o console.', 'error');
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                Carrinho de Compras
            </Typography>

            {cart && cart.items?.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produto</TableCell>
                                    <TableCell>Quantidade</TableCell>
                                    <TableCell align="right">Preço Unitário</TableCell>
                                    <TableCell align="right">Subtotal</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.items.map((item) => (
                                    <TableRow key={item.productId}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell align="right">R$ {Number(item.price).toFixed(2)}</TableCell>
                                        <TableCell align="right">R$ {Number(item.total).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Typography variant="h6" sx={{ mt: 2, textAlign: 'right' }}>
                        Total: R$ {Number(cart.total).toFixed(2)}
                    </Typography>

                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 2 }}
                        onClick={handleCheckout}
                    >
                        Finalizar Compra
                    </Button>
                </>
            ) : (
                <Typography>Seu carrinho está vazio.</Typography>
            )}
        </>
    );
}

export default CartPage;