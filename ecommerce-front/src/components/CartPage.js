import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Typography, Button, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, CircularProgress, IconButton, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import api from '../api';
import { useCart } from '../context/CartContext';

function CartPage({ showSnackbar }) {
    // Pegamos a nova função 'updateQuantity' do contexto
    const { cart, loading, clearCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = async (productId, newQuantity) => {
        try {
            await updateQuantity(productId, newQuantity);
            // O snackbar de sucesso é opcional, pode poluir a tela.
            // showSnackbar('Quantidade atualizada!', 'success');
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Estoque insuficiente!';
            showSnackbar(errorMsg, 'error');
        }
    };

    // A função de remover o item inteiro continua aqui para o ícone de lixeira
    const handleRemoveItem = async (productId) => {
        // A lógica de remoção agora está dentro do 'updateQuantity' quando a quantidade é 0
        await handleQuantityChange(productId, 0);
        showSnackbar('Item removido do carrinho!', 'success');
    };

    const handleCheckout = async () => {
        try {
            const response = await api.post('/api/cart/checkout');
            clearCart();
            showSnackbar(response.data || 'Compra finalizada com sucesso!', 'success');
            navigate('/order-history');
        } catch (error) {
            console.error("Erro ao finalizar a compra:", error);
            const errorMessage = error.response?.data || 'Erro ao finalizar a compra.';
            showSnackbar(errorMessage, 'error');
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
                                    <TableCell align="center">Quantidade</TableCell>
                                    <TableCell align="right">Preço Unitário</TableCell>
                                    <TableCell align="right">Subtotal</TableCell>
                                    <TableCell align="center">Remover</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cart.items.map((item) => (
                                    <TableRow key={item.productId}>
                                        <TableCell>{item.name}</TableCell>

                                        {/* **** CÉLULA DE QUANTIDADE MODIFICADA **** */}
                                        <TableCell align="center">
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                                >
                                                    <RemoveCircleOutlineIcon />
                                                </IconButton>
                                                <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                                >
                                                    <AddCircleOutlineIcon />
                                                </IconButton>
                                            </Box>
                                        </TableCell>

                                        <TableCell align="right">R$ {Number(item.price).toFixed(2)}</TableCell>
                                        <TableCell align="right">R$ {Number(item.total).toFixed(2)}</TableCell>
                                        <TableCell align="center">
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
                        disabled={!cart.items.length}
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