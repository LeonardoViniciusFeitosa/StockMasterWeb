package com.StockMaster.API.Service;

import com.StockMaster.API.Models.Product;
import com.StockMaster.API.Repositories.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public Product createProduct(Product product){
      return repository.save(product);
    };

    public List<Product> getAllProducts(){
        return repository.findAll();
    }

    public Product getProductById(Long id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Produto não encontrado."));
    }

    public Product updateProductById(Long id, Product updatedProduct){
        Product product = getProductById(id);
        product.setCategory(updatedProduct.getCategory());
        product.setCostValue(updatedProduct.getCostValue());
        product.setName(updatedProduct.getName());
        product.setNotes(updatedProduct.getNotes());
        product.setQuantity(updatedProduct.getQuantity());
        product.setSellValue(updatedProduct.getSellValue());
        product.setSupplier(updatedProduct.getSupplier());

        return repository.save(product);
    }

    public void deleteProductById(Long id){
        repository.deleteById(id);
    }

    public void increaseStock(Product product, int quantity){
        if (quantity <= 0){
            throw new RuntimeException("Quantidade inválida");
        }
        product.setQuantity(product.getQuantity() + quantity);
        repository.save(product);
    }

    public void decreaseProduct(Product product, int quantity){
        if (quantity <= 0){
            throw new RuntimeException(("Quantidade inválida"));
        }
        if(product.getQuantity() < quantity){
            throw new RuntimeException("Estoque insuficiente");
        }
        product.setQuantity(product.getQuantity() - quantity);
        repository.save(product);
    }
}
