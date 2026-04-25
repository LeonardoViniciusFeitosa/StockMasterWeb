package com.StockMaster.API.Service;

import com.StockMaster.API.DTO.SaleDTO;
import com.StockMaster.API.DTO.SaleItemDTO;
import com.StockMaster.API.Exceptions.BusinessException;
import com.StockMaster.API.Exceptions.ResourceNotFoundException;
import com.StockMaster.API.Models.Customer;
import com.StockMaster.API.Models.Product;
import com.StockMaster.API.Models.Sale;
import com.StockMaster.API.Models.SaleItem;
import com.StockMaster.API.Repositories.SaleRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
        // CONSERTADO POR CODEX
        validateSale(dto);
        Sale sale = new Sale();
        sale.setSaleDate(dto.getDate() != null ? dto.getDate() : LocalDate.now());

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
        //CODEX
    }

    public Sale getSaleById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Essa venda não existe."));
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

    // CONSERTADO POR CODEX
    private void validateSale(SaleDTO dto) {
        if (dto == null) {
            throw new BusinessException("Os dados da venda são obrigatórios.");
        }
        if (dto.getCustomerId() == null) {
            throw new BusinessException("O cliente da venda é obrigatório.");
        }
        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new BusinessException("A venda deve possuir pelo menos um item.");
        }
        for (SaleItemDTO item : dto.getItems()) {
            if (item.getProductId() == null) {
                throw new BusinessException("Todos os itens da venda devem possuir produto.");
            }
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new BusinessException("Todos os itens da venda devem possuir quantidade válida.");
            }
        }
    }
    //CODEX
}
