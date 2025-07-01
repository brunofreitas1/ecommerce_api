import React, { useState, useEffect } from 'react';
import {
    Box, Button, TextField, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api';

function CategoryManager({ showSnackbar }) {
    const [categories, setCategories] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ id: null, name: '', description: '' });

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error("Erro ao buscar categorias:", error);
            showSnackbar("Erro ao buscar categorias.", "error");
        }
    };

    useEffect(() => {
        fetchCategories().then(r => {});
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentCategory({ ...currentCategory, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = isEditing ? 'put' : 'post';
        const url = isEditing ? `/api/categories/${currentCategory.id}` : '/api/categories';

        try {
            await api[method](url, { name: currentCategory.name, description: currentCategory.description });
            showSnackbar(`Categoria ${isEditing ? 'atualizada' : 'criada'} com sucesso!`, 'success');
            resetForm();
            await fetchCategories();
        } catch (error) {
            showSnackbar('Erro ao salvar categoria.', 'error');
        }
    };

    const handleEdit = (category) => {
        setIsEditing(true);
        setCurrentCategory(category);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar esta categoria?')) {
            try {
                await api.delete(`/api/categories/${id}`);
                showSnackbar('Categoria deletada com sucesso!', 'success');
                fetchCategories();
            } catch (error) {
                showSnackbar('Erro ao deletar categoria.', 'error');
            }
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentCategory({ id: null, name: '', description: '' });
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Gerenciador de Categorias</Typography>

            <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6">{isEditing ? 'Editar Categoria' : 'Nova Categoria'}</Typography>
                <TextField label="Nome" name="name" value={currentCategory.name} onChange={handleInputChange} fullWidth margin="normal" required />
                <TextField label="Descrição" name="description" value={currentCategory.description} onChange={handleInputChange} fullWidth margin="normal" required />
                <Box sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained">{isEditing ? 'Salvar' : 'Criar Categoria'}</Button>
                    {isEditing && <Button onClick={resetForm} sx={{ ml: 2 }}>Cancelar Edição</Button>}
                </Box>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell align="right">Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleEdit(category)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(category.id)}><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default CategoryManager;