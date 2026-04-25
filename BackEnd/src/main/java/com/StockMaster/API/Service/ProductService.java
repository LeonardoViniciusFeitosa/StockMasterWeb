package com.StockMaster.API.Service;

import com.StockMaster.API.Exceptions.BusinessException;
import com.StockMaster.API.Exceptions.ResourceNotFoundException;
import com.StockMaster.API.Models.Product;
import com.StockMaster.API.Repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;
    private final SupplierService supplierService;

    public ProductService(ProductRepository repository, SupplierService supplierService) {
        this.repository = repository;
        this.supplierService = supplierService;
    }

    public Product createProduct(Product product) {
        // CONSERTADO POR CODEX
        validateProduct(product);
        product.setSupplier(supplierService.getSupplierById(product.getSupplier().getId()));
        return repository.save(product);
        //CODEX
    }

    public List<Product> getAllProducts() {
        return repository.findAll();
    }

    public Product getProductById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));
    }

    public Product updateProductById(Long id, Product updatedProduct) {
        // CONSERTADO POR CODEX
        validateProduct(updatedProduct);
        Product product = getProductById(id);
        product.setCategory(updatedProduct.getCategory());
        product.setCostValue(updatedProduct.getCostValue());
        product.setName(updatedProduct.getName());
        product.setNotes(updatedProduct.getNotes());
        product.setQuantity(updatedProduct.getQuantity());
        product.setSellValue(updatedProduct.getSellValue());
        product.setSupplier(supplierService.getSupplierById(updatedProduct.getSupplier().getId()));

        return repository.save(product);
        //CODEX
    }

    public void deleteProductById(Long id) {
        Product product = getProductById(id);
        repository.delete(product);
    }

    public void increaseStock(Product product, int quantity) {
        if (quantity <= 0) {
            throw new BusinessException("Quantidade inválida.");
        }
        product.setQuantity(product.getQuantity() + quantity);
        repository.save(product);
    }

    public void decreaseProduct(Product product, int quantity) {
        if (quantity <= 0) {
            throw new BusinessException("Quantidade inválida.");
        }
        if (product.getQuantity() < quantity) {
            throw new BusinessException("Estoque insuficiente.");
        }
        product.setQuantity(product.getQuantity() - quantity);
        repository.save(product);
    }

    // CONSERTADO POR CODEX
    private void validateProduct(Product product) {
        if (product == null) {
            throw new BusinessException("Os dados do produto são obrigatórios.");
        }
        if (isBlank(product.getName())) {
            throw new BusinessException("O nome do produto é obrigatório.");
        }
        if (isBlank(product.getCategory())) {
            throw new BusinessException("A categoria do produto é obrigatória.");
        }
        if (product.getSupplier() == null || product.getSupplier().getId() == null) {
            throw new BusinessException("O fornecedor do produto é obrigatório.");
        }
        if (product.getQuantity() < 0) {
            throw new BusinessException("A quantidade do produto não pode ser negativa.");
        }
        if (product.getCostValue() == null) {
            throw new BusinessException("O valor de custo do produto é obrigatório.");
        }
        if (product.getSellValue() == null) {
            throw new BusinessException("O valor de venda do produto é obrigatório.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
    //CODEX
}
