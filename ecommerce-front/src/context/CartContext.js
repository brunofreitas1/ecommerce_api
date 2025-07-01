import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    const fetchCart = useCallback(async () => {
        if (!token) {
            setCart({ items: [], total: 0 });
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await api.get('/api/cart');
            setCart(response.data);
        } catch (error) {
            console.error("Não foi possível buscar o carrinho:", error);
            setCart({ items: [], total: 0 });
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity) => {
        try {
            const response = await api.post(`/api/cart/add/${productId}/${quantity}`);
            setCart(response.data);
            return response;
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
            throw error;
        }
    };

    // **** NOVA FUNÇÃO ADICIONADA ****
    const updateQuantity = async (productId, newQuantity) => {
        try {
            // Se a nova quantidade for 0 ou menos, removemos o item
            if (newQuantity <= 0) {
                const response = await api.delete(`/api/cart/remove/${productId}`);
                setCart(response.data);
                return response;
            }
            // Caso contrário, atualizamos para a nova quantidade
            const response = await api.put(`/api/cart/update/${productId}/${newQuantity}`);
            setCart(response.data);
            return response;
        } catch (error) {
            console.error("Erro ao atualizar quantidade:", error);
            throw error;
        }
    };

    const clearCart = () => {
        setCart({ items: [], total: 0 });
    };

    // Adicionamos a nova função ao 'value' do provider
    const value = {
        cart,
        loading,
        fetchCart,
        addToCart,
        updateQuantity, // <--- ADICIONADA AQUI
        clearCart,
        setCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};