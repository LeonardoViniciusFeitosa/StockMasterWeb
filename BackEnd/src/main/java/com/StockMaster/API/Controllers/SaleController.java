package com.StockMaster.API.Controllers;

import com.StockMaster.API.DTO.SaleDTO;
import com.StockMaster.API.Models.Sale;
import com.StockMaster.API.Service.SaleService;
import jakarta.persistence.PostLoad;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
public class SaleController {
    private final SaleService service;

    public SaleController(SaleService service) {
        this.service = service;
    }

    @PostMapping
    public Sale createSale(@RequestBody SaleDTO dto){
        return service.createSale(dto);
    }

    @GetMapping
    public List<Sale> getAll(){
        return service.getAllSales();
    }

    @GetMapping("/{id}")
    public Sale getSaleById(@PathVariable Long id){
        return service.getSaleById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteSale(@PathVariable Long id){
        service.deleteSaleById(id);
    }
}
