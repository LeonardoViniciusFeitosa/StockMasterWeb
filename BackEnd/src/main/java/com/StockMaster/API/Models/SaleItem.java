package com.StockMaster.API.Models;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "saleItems")
public class SaleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private BigDecimal sellValue;

    @Column(nullable = false)
    private BigDecimal costValue;

    @ManyToOne
    @JoinColumn(name = "saleId")
    private Sale sale;

    @ManyToOne
    @JoinColumn(name = "productId")
    private Product product;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getSellValue() {
        return sellValue;
    }

    public void setSellValue(BigDecimal value) {
        this.sellValue = value;
    }

    public BigDecimal getCostValue() {
        return costValue;
    }

    public void setCostValue(BigDecimal profit) {
        this.costValue = profit;
    }

    public Sale getSale() {
        return sale;
    }

    public void setSale(Sale sale) {
        this.sale = sale;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
