import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Card, CardMedia, CardContent, Grid, Paper } from '@mui/material';
import api from '../api';
import { useCart } from '../context/CartContext'; // 1. IMPORTE O HOOK

function ProductDetailPage({ showSnackbar }) {
    const { id } = useParams();
    const { addToCart } = useCart(); // 2. PEGUE A FUNÇÃO DO CONTEXTO
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/api/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Erro ao buscar detalhes do produto:", error);
                showSnackbar("Produto não encontrado.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, showSnackbar]);

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            await addToCart(product.id, 1); // 3. USE A FUNÇÃO DO CONTEXTO
            showSnackbar(`${product.name} adicionado ao carrinho!`, 'success');
        } catch (error) {
            showSnackbar('Erro ao adicionar o produto. Você está logado?', 'error');
        }
    };

    // O resto do componente continua igual...
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!product) {
        return (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="h5">Produto não encontrado</Typography>
                <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
                    Voltar à Loja
                </Button>
            </Box>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            sx={{ width: '100%', maxHeight: 500, objectFit: 'contain' }}
                            image={product.imageBase64 ? `data:image/jpeg;base64,${product.imageBase64}` : 'https://via.placeholder.com/500'}
                            alt={product.name}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {product.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            Categoria: {product.categoryName || 'N/A'}
                        </Typography>
                        <Typography variant="body1" sx={{ my: 2 }}>
                            {product.description}
                        </Typography>
                        <Typography variant="h5" color="primary" sx={{ my: 2 }}>
                            R$ {product.price ? product.price.toFixed(2) : '0.00'}
                        </Typography>
                        <Typography variant="body2" color={product.stock > 0 ? 'success.main' : 'error.main'}>
                            {product.stock > 0 ? `${product.stock} em estoque` : 'Fora de estoque'}
                        </Typography>
                        <Box sx={{ mt: 'auto' }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                            >
                                Adicionar ao Carrinho
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}

export default ProductDetailPage;