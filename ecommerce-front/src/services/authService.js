import api from '../api';

const register = (name, email, password) => { // Alterado de 'username' para 'name'
    return api.post('/api/auth/register', {
        name, // O objeto agora envia 'name', que é o correto
        email,
        password,
    });
};

const login = async (email, password) => {
    const response = await api.post('/api/auth/login', {
        email,
        password,
    });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('token');
};

const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

const authService = {
    register,
    login,
    logout,
    isAuthenticated,
};

export default authService;