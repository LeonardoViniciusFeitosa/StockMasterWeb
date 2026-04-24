package com.StockMaster.API.Controllers;

import com.StockMaster.API.DTO.SaleItemDTO;
import com.StockMaster.API.Models.SaleItem;
import com.StockMaster.API.Service.SaleItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
public class SaleItemController {
    private final SaleItemService service;

    public SaleItemController(SaleItemService service) {
        this.service = service;
    }

    @PostMapping("/{saleId}/item")
    public SaleItem CreateSaleItem(@PathVariable Long saleId, @RequestBody SaleItemDTO dto) {
        return service.addItemToSale(saleId, dto);
    }

    @GetMapping("/{saleId}/item")
    public List<SaleItem> getItemsBySale(@PathVariable Long saleId){
        return service.getItemsBySale(saleId);
    }

    @GetMapping("/{id}")
    public SaleItem getItemById(@PathVariable Long id){
        return service.getSaleItemById(id);
    }

    @PutMapping("/{id}")
    public SaleItem updateItem(@PathVariable Long id, @RequestBody SaleItemDTO dto){
        return service.updateSaleItem(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id){
        service.deleteSaleItemById(id);
    }
}
