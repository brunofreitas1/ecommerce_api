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
    CircularProgress,
    IconButton,
    TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
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

    const handleUpdateQuantity = async (productId, quantity) => {
        try {
            await api.put(`/api/cart/update/${productId}/${quantity}`);
            fetchCart();
            showSnackbar('Quantidade atualizada!', 'success');
        } catch (error) {
            console.error("Erro ao atualizar a quantidade:", error);
            showSnackbar('Erro ao atualizar a quantidade.', 'error');
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await api.delete(`/api/cart/remove/${productId}`);
            fetchCart();
            showSnackbar('Item removido do carrinho!', 'success');
        } catch (error) {
            console.error("Erro ao remover o item:", error);
            showSnackbar('Erro ao remover o item.', 'error');
        }
    };

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
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.items.map((item) => (
                                    <TableRow key={item.productId}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)} size="small">
                                                    <RemoveIcon />
                                                </IconButton>
                                                <TextField
                                                    value={item.quantity}
                                                    size="small"
                                                    style={{ width: '50px', textAlign: 'center' }}
                                                    readOnly
                                                />
                                                <IconButton onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)} size="small">
                                                    <AddIcon />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                        <TableCell align="right">R$ {Number(item.price).toFixed(2)}</TableCell>
                                        <TableCell align="right">R$ {Number(item.total).toFixed(2)}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleRemoveItem(item.productId)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
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