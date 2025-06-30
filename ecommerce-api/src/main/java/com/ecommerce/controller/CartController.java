package com.ecommerce.controller;

import com.ecommerce.dto.CartDTO;
import com.ecommerce.dto.CartItemDTO;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public CartController(CartService cartService,
                          ProductRepository productRepository,
                          OrderRepository orderRepository) {
        this.cartService = cartService;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<CartDTO> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/add/{productId}/{quantity}")
    public ResponseEntity<CartDTO> addToCart(@PathVariable Long productId,
                                             @PathVariable Integer quantity) {
        return ResponseEntity.ok(cartService.addProduct(productId, quantity));
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<CartDTO> removeFromCart(@PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeProduct(productId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<String> checkout() {
        CartDTO cart = cartService.getCart();
        if (cart.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Carrinho está vazio.");
        }

        Order order = new Order();
        order.setTotal(cart.getTotal());
        order.setItems(new ArrayList<>());
        order.setStatus("PROCESSING");
        order.setOrderDate(java.time.LocalDateTime.now());

        for (CartItemDTO item : cart.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado."));

            if (product.getStock() < item.getQuantity()) {
                return ResponseEntity.badRequest()
                        .body("Estoque insuficiente para o produto: " + product.getName());
            }

            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setOrder(order);

            order.getItems().add(orderItem);
        }

        orderRepository.save(order);
        cartService.clearCart();

        return ResponseEntity.ok("Pedido realizado com sucesso.");
    }
}
