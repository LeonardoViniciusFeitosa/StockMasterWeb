package com.StockMaster.API.Service;

import com.StockMaster.API.DTO.SaleDTO;
import com.StockMaster.API.DTO.SaleItemDTO;
import com.StockMaster.API.Models.Customer;
import com.StockMaster.API.Models.Product;
import com.StockMaster.API.Models.Sale;
import com.StockMaster.API.Models.SaleItem;
import com.StockMaster.API.Repositories.SaleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleService {
    private final SaleRepository repository;
    private final ProductService pService;
    private final CustomerService cService;

    public SaleService(SaleRepository repository, ProductService pService, CustomerService cService) {
        this.repository = repository;
        this.pService = pService;
        this.cService = cService;
    }

    @Transactional
    public Sale createSale(SaleDTO dto) {
        Sale sale = new Sale();
        sale.setSaleDate(dto.getDate());

        Customer customer = cService.getCustomerById(dto.getCustomerId());
        sale.setCustomer(customer);

        for (SaleItemDTO itemDTO : dto.getItems()) {
            Product product = pService.getProductById(itemDTO.getProductId());

            SaleItem item = new SaleItem();
            item.setSale(sale);
            item.setProduct(product);

            item.setQuantity(itemDTO.getQuantity());

            item.setCostValue(product.getCostValue());
            item.setSellValue(product.getSellValue());

            pService.decreaseProduct(product, itemDTO.getQuantity());

            sale.getItems().add(item);
        }
        return repository.save(sale);
    }

    public Sale getSaleById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Essa venda não existe."));
    }

    public List<Sale> getAllSales() {
        return repository.findAll();
    }

    @Transactional
    public void deleteSaleById(Long id) {
        Sale sale = getSaleById(id);

        for (SaleItem item : sale.getItems()) {
            pService.increaseStock(item.getProduct(), item.getQuantity());
        }

        repository.delete(sale);
    }
}
