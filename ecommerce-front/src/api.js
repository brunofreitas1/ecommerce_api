// src/api.js
import axios from 'axios';

// Cria uma instância do axios com a URL base do seu backend
const api = axios.create({
    baseURL: 'http://localhost:8080',
});

// AQUI ESTÁ A LÓGICA ESSENCIAL: O Interceptor de Requisições
// 'use()' adiciona um "middleware" que é executado antes de cada requisição
api.interceptors.request.use(
    (config) => {
        // 1. Pega o token do localStorage
        const token = localStorage.getItem('token');

        // 2. Se o token existir, adiciona-o ao cabeçalho de autorização
        if (token) {
            // Adiciona o prefixo "Bearer ", que é o padrão JWT
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        // 3. Retorna a configuração modificada para que a requisição possa continuar
        return config;
    },
    (error) => {
        // Faz algo com o erro da requisição
        return Promise.reject(error);
    }
);

export default api;