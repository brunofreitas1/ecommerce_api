package com.ecommerce.controller;

import com.ecommerce.entity.Customer;
import com.ecommerce.entity.Order;
import com.ecommerce.repository.CustomerRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.dto.OrderDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping
    public List<OrderDTO> listAll() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public OrderDTO findById(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
        return convertToDTO(order);
    }

    @PostMapping
    public OrderDTO create(@Valid @RequestBody OrderDTO dto) {
        Order order = new Order();
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(dto.getStatus());
        order.setTotal(dto.getTotal());

        if (dto.getCustomerId() != null) {
            Customer customer = customerRepository.findById(dto.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            order.setCustomer(customer);
        }

        Order saved = orderRepository.save(order);
        return convertToDTO(saved);
    }

    @PutMapping("/{id}")
    public OrderDTO update(@PathVariable Long id, @Valid @RequestBody OrderDTO dto) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        order.setStatus(dto.getStatus());
        order.setTotal(dto.getTotal());
        Order saved = orderRepository.save(order);
        return convertToDTO(saved);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        orderRepository.deleteById(id);
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotal(order.getTotal());
        dto.setStatus(order.getStatus());
        dto.setCustomerId(order.getCustomer() != null ? order.getCustomer().getId() : null);
        return dto;
    }
}
