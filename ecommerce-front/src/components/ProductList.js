import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardMedia, CardActions, Button, Typography, CircularProgress } from '@mui/material';
import api from '../api';

function ProductList({ showSnackbar }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                const response = await api.get('/api/products');
                setProducts(response.data);
            } catch (e) {
                showSnackbar("Erro ao carregar produtos.", "error");
            }
            setLoading(false);
        };
        loadProducts();
    }, [showSnackbar]);

    const handleAddToCart = async (productId) => {
        try {
            await api.post(`/api/cart/add/${productId}/1`);
            showSnackbar("Produto adicionado ao carrinho!", "success");
        } catch (e) {
            showSnackbar("Erro ao adicionar produto.", "error");
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Produtos
            </Typography>
            <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={product.imageBase64 ? `data:image/jpeg;base64,${product.imageBase64}` : `https://source.unsplash.com/400x300/?product,${product.name}`}
                                alt={product.name}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div">
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {product.description}
                                </Typography>
                                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                                    R$ {Number(product.price).toFixed(2)}
                                </Typography>
                            </CardContent>
                            <CardActions sx={{ mt: 'auto' }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={() => handleAddToCart(product.id)}
                                >
                                    Adicionar ao Carrinho
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </>
    );
}

export default ProductList;