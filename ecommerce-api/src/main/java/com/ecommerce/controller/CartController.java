package com.ecommerce.controller;

import com.ecommerce.dto.CartDTO;
import com.ecommerce.dto.CartItemDTO;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public CartController(CartService cartService, ProductRepository productRepository, OrderRepository orderRepository) {
        this.cartService = cartService;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<CartDTO> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/add/{productId}/{quantity}")
    public ResponseEntity<CartDTO> addToCart(@PathVariable Long productId, @PathVariable Integer quantity) {
        return ResponseEntity.ok(cartService.addProduct(productId, quantity));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartDTO> removeFromCart(@PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeProduct(productId));
    }

    @PutMapping("/update/{productId}/{quantity}")
    public ResponseEntity<CartDTO> updateCartItem(@PathVariable Long productId, @PathVariable Integer quantity) {
        return ResponseEntity.ok(cartService.updateProductQuantity(productId, quantity));
    }

    @PostMapping("/checkout")
    public ResponseEntity<String> checkout() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            return ResponseEntity.status(401).body("Usuário não autenticado.");
        }
        User user = (User) authentication.getPrincipal();

        CartDTO cart = cartService.getCart();
        if (cart.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("O carrinho está vazio.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setTotal(cart.getTotal());
        order.setItems(new ArrayList<>());
        order.setStatus("PROCESSANDO");
        order.setOrderDate(LocalDateTime.now());

        for (CartItemDTO itemDTO : cart.getItems()) {
            Product product = productRepository.findById(itemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

            if (product.getStock() < itemDTO.getQuantity()) {
                return ResponseEntity.badRequest()
                        .body("Estoque insuficiente para o produto: " + product.getName());
            }

            product.setStock(product.getStock() - itemDTO.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemDTO.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setOrder(order);

            order.getItems().add(orderItem);
        }

        orderRepository.save(order);
        cartService.clearCart();

        return ResponseEntity.ok("Pedido realizado com sucesso. ID do Pedido: " + order.getId());
    }
}