package com.ecommerce.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import com.ecommerce.entity.Category;

@Entity
public class Product {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @jakarta.validation.constraints.NotBlank
    private String name;

    private String description;

    @jakarta.validation.constraints.NotNull
    @jakarta.validation.constraints.Positive
    private BigDecimal price;

    @jakarta.validation.constraints.NotNull
    @jakarta.validation.constraints.Min(0)
    private Integer stock;

    @Lob
    @Column(name = "image_data")
    private byte[] imageData;

    // Getters e Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }

    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getStock() { return stock; }

    public void setStock(Integer stock) { this.stock = stock; }

    public byte[] getImageData() { return imageData; }

    public void setImageData(byte[] imageData) { this.imageData = imageData; }

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
}


