package com.ecommerce.service;

import com.ecommerce.dto.CartDTO;
import com.ecommerce.dto.CartItemDTO;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {

    private final ProductRepository productRepository;
    private final List<CartItemDTO> cartItems = new ArrayList<>();

    public CartService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public CartDTO addProduct(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        Optional<CartItemDTO> optional = cartItems.stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();

        if (optional.isPresent()) {
            CartItemDTO existing = optional.get();
            existing.setQuantity(existing.getQuantity() + quantity);
            existing.setTotal(product.getPrice().multiply(BigDecimal.valueOf(existing.getQuantity())));
        } else {
            CartItemDTO item = new CartItemDTO();
            item.setProductId(product.getId());
            item.setName(product.getName());
            item.setPrice(product.getPrice());
            item.setQuantity(quantity);
            item.setTotal(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
            cartItems.add(item);
        }

        return getCart();
    }

    public CartDTO removeProduct(Long productId) {
        cartItems.removeIf(item -> item.getProductId().equals(productId));
        return getCart();
    }

    public CartDTO getCart() {
        BigDecimal total = cartItems.stream()
                .map(CartItemDTO::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        CartDTO dto = new CartDTO();
        dto.setItems(cartItems);
        dto.setTotal(total);
        return dto;
    }

    public CartDTO updateProductQuantity(Long productId, Integer quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

        if (quantity <= 0) {
            return removeProduct(productId);
        }

        Optional<CartItemDTO> optional = cartItems.stream()
                .filter(item -> item.getProductId().equals(productId))
                .findFirst();

        if (optional.isPresent()) {
            CartItemDTO existing = optional.get();
            existing.setQuantity(quantity);
            existing.setTotal(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
        } else {
        }

        return getCart();
    }

    public void clearCart() {
        cartItems.clear();
    }
}
