import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import authService from '../services/authService';

function Register() {
    const [name, setName] = useState(''); // Alterado de 'username' para 'name'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            // Agora passamos 'name' para o serviço de autenticação
            await authService.register(name, email, password);
            setSuccess('Usuário registrado com sucesso! Você será redirecionado para o login.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError('Falha no registro. Verifique os dados ou tente um email/usuário diferente.');
            console.error(err);
        }
    };

    return (
        <Container maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Registrar
                </Typography>
                <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name" // Alterado de 'username' para 'name'
                        label="Nome de Usuário"
                        name="name" // Alterado de 'username' para 'name'
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Senha"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && <Typography color="error" variant="body2">{error}</Typography>}
                    {success && <Typography color="success" variant="body2">{success}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Registrar
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default Register;