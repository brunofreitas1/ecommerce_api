package com.ecommerce.entity;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "users")
public class User implements UserDetails { // A mudança principal está aqui

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String role;

    // Construtores
    public User() {}

    public User(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // --- MÉTODOS EXIGIDOS PELA INTERFACE UserDetails ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Retorna a permissão/role do utilizador para o Spring Security
        return List.of(new SimpleGrantedAuthority(this.role));
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        // Para o Spring Security, o nosso "username" é o e-mail
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // A nossa lógica não prevê contas que expiram
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // A nossa lógica não prevê contas bloqueadas
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // A nossa lógica não prevê credenciais que expiram
    }

    @Override
    public boolean isEnabled() {
        return true; // A nossa lógica assume que todas as contas estão ativas
    }

    // --- GETTERS E SETTERS TRADICIONAIS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}