package com.StockMaster.API.Service;

import com.StockMaster.API.DTO.SaleItemDTO;
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

    public SaleItem getSaleItemById(Long id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Esse item não existe"));
    }

    public List<SaleItem> getItemsBySale(Long saleId){
        return repository.findBySaleId(saleId);
    }

    @Transactional
    public SaleItem addItemToSale(Long saleId, SaleItemDTO dto){
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
    }

    @Transactional
    public SaleItem updateSaleItem(Long itemId, SaleItemDTO dto){
        SaleItem item = getSaleItemById(itemId);

        Product oldProduct = item.getProduct();
        Product newProduct = pService.getProductById(dto.getProductId());

        int oldQuantity = item.getQuantity();
        int newQuantity = dto.getQuantity();

        if (newQuantity <= 0){
            throw new RuntimeException("Quantidade inválida");
        }

        if (!oldProduct.getId().equals(newProduct.getId())){
            pService.increaseStock(oldProduct, oldQuantity);

            pService.decreaseProduct(newProduct, newQuantity);

            item.setProduct(newProduct);
            item.setQuantity(newQuantity);
            item.setCostValue(newProduct.getCostValue());
            item.setSellValue(newProduct.getSellValue());
        } else {
            int difference = newQuantity - oldQuantity;

            if (difference > 0){
                pService.decreaseProduct(newProduct, difference);
            }
            else if (difference < 0){
                pService.increaseStock(newProduct, Math.abs(difference));
            }

            item.setQuantity(newQuantity);
        }

        return repository.save(item);
    }

    @Transactional
    public void deleteSaleItemById(Long id){
        SaleItem item = getSaleItemById(id);
        Product product = item.getProduct();

        pService.increaseStock(product, item.getQuantity());
        repository.delete(item);
    }
}
