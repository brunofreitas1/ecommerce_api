package com.ecommerce.dto;

import java.math.BigDecimal;
import java.util.List;

public class CartDTO {
    private List<CartItemDTO> items;
    private BigDecimal total;

    // getters e setters

    public List<CartItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CartItemDTO> items) {
        this.items = items;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }
}
