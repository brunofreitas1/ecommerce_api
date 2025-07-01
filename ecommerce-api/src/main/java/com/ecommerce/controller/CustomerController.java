package com.ecommerce.controller;

import com.ecommerce.dto.CustomerDTO;
import com.ecommerce.entity.Customer;
import com.ecommerce.entity.User;
import com.ecommerce.repository.CustomerRepository;
import com.ecommerce.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    // Precisamos do UserRepository para associar o Customer ao User
    @Autowired
    private UserRepository userRepository;

    // O método de listagem agora precisa buscar os dados do User
    @GetMapping
    public List<CustomerDTO> listAll() {
        return customerRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // O método de busca por ID também foi ajustado
    @GetMapping("/{id}")
    public ResponseEntity<CustomerDTO> findById(@PathVariable Long id) {
        return customerRepository.findById(id)
                .map(customer -> ResponseEntity.ok(convertToDTO(customer)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Este método agora cria um perfil de cliente para um usuário existente.
     * O DTO deve conter o userId.
     */
    @PostMapping
    public CustomerDTO create(@Valid @RequestBody CustomerDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Usuário com ID " + dto.getUserId() + " não encontrado."));

        Customer customer = new Customer();
        customer.setUser(user);
        customer.setAddress(dto.getAddress());
        customer.setPhone(dto.getPhone());

        Customer saved = customerRepository.save(customer);
        return convertToDTO(saved);
    }

    /**
     * Este método agora atualiza apenas os dados do perfil do cliente (endereço e telefone).
     * O nome e o e-mail não são alterados aqui.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CustomerDTO> update(@PathVariable Long id, @Valid @RequestBody CustomerDTO dto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        customer.setAddress(dto.getAddress());
        customer.setPhone(dto.getPhone());

        Customer saved = customerRepository.save(customer);
        return ResponseEntity.ok(convertToDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // O método de conversão foi atualizado para pegar os dados do User associado.
    private CustomerDTO convertToDTO(Customer customer) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(customer.getId());
        dto.setAddress(customer.getAddress());
        dto.setPhone(customer.getPhone());

        if (customer.getUser() != null) {
            dto.setUserId(customer.getUser().getId());
            dto.setName(customer.getUser().getName());
            dto.setEmail(customer.getUser().getEmail());
        }

        return dto;
    }
}