import React, { useState, useEffect } from 'react';
import {
    Box, Button, TextField, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Select, MenuItem,
    FormControl, InputLabel, Grid, Modal, Card, CardMedia
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload'; // Ícone para o upload
import api from '../api';

// Estilo para a janela Modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function ProductManager({ showSnackbar }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ id: null, name: '', description: '', price: 0, stock: 0, categoryId: '' });

    // Estado para o Modal de upload
    const [openModal, setOpenModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [productIdForUpload, setProductIdForUpload] = useState(null);

    const fetchProducts = async () => {
        const response = await api.get('/api/products');
        setProducts(response.data);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchProducts();
                const categoriesResponse = await api.get('/api/categories');
                setCategories(categoriesResponse.data);
            } catch (error) {
                showSnackbar("Erro ao carregar dados.", "error");
            }
        };
        fetchData();
    }, [showSnackbar]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct({ ...currentProduct, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentProduct.categoryId) {
            showSnackbar("Por favor, selecione uma categoria.", "error");
            return;
        }
        const method = isEditing ? 'put' : 'post';
        const url = isEditing ? `/api/products/${currentProduct.id}` : '/api/products';
        const productData = { name: currentProduct.name, description: currentProduct.description, price: currentProduct.price, stock: currentProduct.stock, categoryId: currentProduct.categoryId };

        try {
            await api[method](url, productData);
            showSnackbar(`Produto ${isEditing ? 'atualizado' : 'criado'}!`, 'success');
            resetForm();
            fetchProducts();
        } catch (error) {
            showSnackbar('Erro ao salvar produto.', 'error');
        }
    };

    const handleEdit = (product) => {
        setIsEditing(true);
        setCurrentProduct({ ...product, categoryId: product.categoryId || '' });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza?')) {
            try {
                await api.delete(`/api/products/${id}`);
                showSnackbar('Produto deletado!', 'success');
                fetchProducts();
            } catch (error) {
                showSnackbar('Erro ao deletar.', 'error');
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentProduct({ id: null, name: '', description: '', price: 0, stock: 0, categoryId: '' });
    };

    // --- Funções para o Upload de Imagem ---
    const handleOpenModal = (productId) => {
        setProductIdForUpload(productId);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedFile(null);
        setProductIdForUpload(null);
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleImageUpload = async () => {
        if (!selectedFile) {
            showSnackbar("Selecione um ficheiro.", "warning");
            return;
        }
        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            await api.post(`/api/products/${productIdForUpload}/image`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            showSnackbar("Imagem enviada com sucesso!", "success");
            handleCloseModal();
            fetchProducts(); // Atualiza a lista para mostrar a nova imagem
        } catch (error) {
            showSnackbar("Erro ao enviar imagem.", "error");
        }
    };

    return (
        <Box>
            {/* O seu formulário de criação/edição permanece o mesmo */}
            <Typography variant="h4" gutterBottom>Gerenciador de Produtos</Typography>

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6">{isEditing ? 'Editar Produto' : 'Novo Produto'}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Nome" name="name" value={currentProduct.name} onChange={handleInputChange} fullWidth required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                            <InputLabel id="category-select-label">Categoria</InputLabel>
                            <Select
                                labelId="category-select-label"
                                name="categoryId"
                                value={currentProduct.categoryId}
                                label="Categoria"
                                onChange={handleInputChange}
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Descrição" name="description" value={currentProduct.description} onChange={handleInputChange} fullWidth multiline rows={3} required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Preço" name="price" type="number" value={currentProduct.price} onChange={handleInputChange} fullWidth required inputProps={{ step: "0.01" }} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField label="Estoque" name="stock" type="number" value={currentProduct.stock} onChange={handleInputChange} fullWidth required />
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained">{isEditing ? 'Salvar Alterações' : 'Criar Produto'}</Button>
                    {isEditing && <Button onClick={resetForm} sx={{ ml: 2 }}>Cancelar Edição</Button>}
                </Box>
            </Paper>

            {/* Tabela de Produtos com Imagem */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead><TableRow><TableCell>Imagem</TableCell><TableCell>Nome</TableCell><TableCell>Categoria</TableCell><TableCell>Preço</TableCell><TableCell>Ações</TableCell></TableRow></TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <CardMedia
                                        component="img"
                                        sx={{ width: 60, height: 60, objectFit: 'cover' }}
                                        image={product.imageBase64 ? `data:image/jpeg;base64,${product.imageBase64}` : 'https://via.placeholder.com/60'}
                                        alt={product.name}
                                    />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.categoryName || 'N/A'}</TableCell>
                                <TableCell>R$ {product.price.toFixed(2)}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpenModal(product.id)} title="Upload de Imagem"><UploadIcon /></IconButton>
                                    <IconButton onClick={() => handleEdit(product)} title="Editar Produto"><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(product.id)} title="Deletar Produto"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal para Upload de Imagem */}
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" component="h2">Upload de Imagem do Produto</Typography>
                    <TextField type="file" onChange={handleFileChange} fullWidth sx={{ mt: 2 }} />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={handleCloseModal}>Cancelar</Button>
                        <Button onClick={handleImageUpload} variant="contained" sx={{ ml: 2 }}>Enviar</Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default ProductManager;