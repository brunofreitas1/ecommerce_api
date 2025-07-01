import React, { useEffect, useState, useCallback } from 'react';
import {
    Grid,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    CircularProgress,
    Box,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import api from '../api';

function ProductList({ showSnackbar }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const fetchProducts = useCallback(async (search = '', category = '') => {
        setLoading(true);
        try {
            let url = '/api/products';
            if (search) {
                url = `/api/products?name=${search}`;
            } else if (category) {
                url = `/api/products?categoryId=${category}`;
            }

            const response = await api.get(url);
            setProducts(response.data);
        } catch (e) {
            console.error("Erro ao carregar produtos:", e);
            showSnackbar("Erro ao carregar produtos.", "error");
        } finally {
            setLoading(false);
        }
    }, [showSnackbar]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [fetchProducts]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
        fetchProducts(searchTerm, '');
        setSelectedCategory('');
    };

    const handleCategoryChange = (event) => {
        const categoryId = event.target.value;
        setSelectedCategory(categoryId);
        setSearchTerm('');
        fetchProducts('', categoryId);
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Produtos
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <TextField
                    label="Pesquisar por nome"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    sx={{ flexGrow: 1 }}
                />
                <Button onClick={handleSearch} variant="contained">Pesquisar</Button>

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Categoria</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        label="Categoria"
                    >
                        <MenuItem value="">
                            <em>Todas</em>
                        </MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category.id} value={category.id}>
                                {category.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

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