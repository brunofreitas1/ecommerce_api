import React, { useEffect, useState } from 'react';
import {
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Box
} from '@mui/material';
import api from '../api';

function OrderHistory({ showSnackbar }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/api/orders/my-orders');
                setOrders(response.data);
            } catch (error) {
                console.error("Erro ao buscar histórico de pedidos:", error);
                showSnackbar('Erro ao buscar seu histórico. Você está logado?', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [showSnackbar]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <>
            <Typography variant="h4" gutterBottom sx={{ mt: 4, mb: 2 }}>
                Meus Pedidos
            </Typography>

            {orders.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID do Pedido</TableCell>
                                <TableCell>Data</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>#{order.id}</TableCell>
                                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell align="right">R$ {Number(order.total).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>Você ainda não fez nenhum pedido.</Typography>
            )}
        </>
    );
}

export default OrderHistory;