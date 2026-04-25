package com.StockMaster.API.Service;

import com.StockMaster.API.DTO.SaleItemDTO;
import com.StockMaster.API.Exceptions.BusinessException;
import com.StockMaster.API.Exceptions.ResourceNotFoundException;
import com.StockMaster.API.Models.Product;
import com.StockMaster.API.Models.Sale;
import com.StockMaster.API.Models.SaleItem;
import com.StockMaster.API.Repositories.SaleItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleItemService {
    private final SaleItemRepository repository;
    private final SaleService sService;
    private final ProductService pService;

    public SaleItemService(SaleItemRepository repository, SaleService sService, ProductService pService) {
        this.repository = repository;
        this.sService = sService;
        this.pService = pService;
    }

    public SaleItem getSaleItemById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Esse item não existe."));
    }

    public List<SaleItem> getItemsBySale(Long saleId) {
        return repository.findBySaleId(saleId);
    }

    @Transactional
    public SaleItem addItemToSale(Long saleId, SaleItemDTO dto) {
        // CONSERTADO POR CODEX
        validateItem(dto);
        Sale sale = sService.getSaleById(saleId);
        Product product = pService.getProductById(dto.getProductId());

        pService.decreaseProduct(product, dto.getQuantity());

        SaleItem item = new SaleItem();
        item.setSale(sale);
        item.setSellValue(product.getSellValue());
        item.setCostValue(product.getCostValue());
        item.setProduct(product);
        item.setQuantity(dto.getQuantity());

        sale.getItems().add(item);
        return repository.save(item);
        //CODEX
    }

    @Transactional
    public SaleItem updateSaleItem(Long itemId, SaleItemDTO dto) {
        // CONSERTADO POR CODEX
        validateItem(dto);
        SaleItem item = getSaleItemById(itemId);

        Product oldProduct = item.getProduct();
        Product newProduct = pService.getProductById(dto.getProductId());

        int oldQuantity = item.getQuantity();
        int newQuantity = dto.getQuantity();

        if (!oldProduct.getId().equals(newProduct.getId())) {
            pService.increaseStock(oldProduct, oldQuantity);
            pService.decreaseProduct(newProduct, newQuantity);

            item.setProduct(newProduct);
            item.setQuantity(newQuantity);
            item.setCostValue(newProduct.getCostValue());
            item.setSellValue(newProduct.getSellValue());
        } else {
            int difference = newQuantity - oldQuantity;

            if (difference > 0) {
                pService.decreaseProduct(newProduct, difference);
            } else if (difference < 0) {
                pService.increaseStock(newProduct, Math.abs(difference));
            }

            item.setQuantity(newQuantity);
        }

        return repository.save(item);
        //CODEX
    }

    @Transactional
    public void deleteSaleItemById(Long id) {
        SaleItem item = getSaleItemById(id);
        Product product = item.getProduct();

        pService.increaseStock(product, item.getQuantity());
        repository.delete(item);
    }

    // CONSERTADO POR CODEX
    private void validateItem(SaleItemDTO dto) {
        if (dto == null) {
            throw new BusinessException("Os dados do item são obrigatórios.");
        }
        if (dto.getProductId() == null) {
            throw new BusinessException("O produto do item é obrigatório.");
        }
        if (dto.getQuantity() == null || dto.getQuantity() <= 0) {
            throw new BusinessException("A quantidade do item deve ser maior que zero.");
        }
    }
    //CODEX
}
