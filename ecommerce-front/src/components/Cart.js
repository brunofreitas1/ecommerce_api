import React, { useState } from 'react';
import api from '../api';

function Cart() {
    const [order, setOrder] = useState(null);

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const checkout = () => {
        const payload = {
            items: cart.map(item => ({
                productId: item.id,
                quantity: item.quantity
            }))
        };

        api.post('/api/checkout', payload)
            .then(res => {
                setOrder(res.data);
                localStorage.removeItem('cart');
            })
            .catch(err => console.error(err));
    };

    if (order) {
        return (
            <div className="mt-4">
                <h2>Pedido Finalizado!</h2>
                <p><strong>Pedido ID:</strong> {order.id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> R$ {order.total.toFixed(2)}</p>

                <h4>Itens:</h4>
                <ul>
                    {order.items.map(item => (
                        <li key={item.productId}>
                            {item.name} - {item.quantity} x R$ {item.price.toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <h2>Carrinho</h2>
            {cart.length === 0 && <p>Seu carrinho está vazio.</p>}
            {cart.length > 0 && (
                <>
                    <ul>
                        {cart.map(item => (
                            <li key={item.id}>
                                {item.name} - {item.quantity} x R$ {item.price.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <button className="btn btn-success" onClick={checkout}>
                        Finalizar Compra
                    </button>
                </>
            )}
        </div>
    );
}

export default Cart;
