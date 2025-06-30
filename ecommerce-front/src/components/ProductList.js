import React, { useEffect, useState } from 'react';
import api from '../api';

function ProductList() {
    const [products, setProducts] = useState([]);

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const exists = cart.find(item => item.id === product.id);

        if (exists) {
            exists.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} adicionado ao carrinho!`);
    };

    useEffect(() => {
        api.get('/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h2>Produtos</h2>
            <div className="row">
                {products.map(prod => (
                    <div className="col-md-3 mb-3" key={prod.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5>{prod.name}</h5>
                                <p>{prod.description}</p>
                                <p><strong>R$ {prod.price.toFixed(2)}</strong></p>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => addToCart(prod)}
                                >
                                    Adicionar ao Carrinho
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;
