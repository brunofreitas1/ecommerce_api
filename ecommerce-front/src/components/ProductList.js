// src/components/ProductList.js
import React, { useEffect, useState, useCallback } from 'react';
import { Grid, Card, CardActionArea, CardContent, CardMedia, Typography, CircularProgress, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../api';
// NENHUM import do SnackbarContext

// 1. O componente agora recebe { showSnackbar } como prop
function ProductList({ showSnackbar }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/products');
            setProducts(response.data);
        } catch (e) {
            console.error("Erro ao carregar produtos:", e);
            showSnackbar("Erro ao carregar produtos.", "error");
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Produtos
            </Typography>
            <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <CardActionArea component={RouterLink} to={`/products/${product.id}`} sx={{ height: '100%' }}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.imageBase64 ? `data:image/jpeg;base64,${product.imageBase64}` : 'https://via.placeholder.com/400x300'}
                                    alt={product.name}
                                    sx={{ objectFit: 'contain' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="h5" color="primary">
                                        R$ {product.price ? product.price.toFixed(2) : '0.00'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </CardActionArea>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default ProductList;