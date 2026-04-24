package com.StockMaster.API.Service;

import com.StockMaster.API.DTO.StockMovementDTO;
import com.StockMaster.API.Models.MovementType;
import com.StockMaster.API.Models.Product;
import com.StockMaster.API.Models.StockMovement;
import com.StockMaster.API.Repositories.ProductRepository;
import com.StockMaster.API.Repositories.StockMovementRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockMovementService {
    private final StockMovementRepository repository;
    private final ProductService pService;

    public StockMovementService(StockMovementRepository repository, ProductService pService) {
        this.repository = repository;
        this.pService = pService;
    }

    @Transactional
    public StockMovement createMovement(StockMovementDTO DTO) {
        Product p = pService.getProductById(DTO.getProductId());
        MovementType type = DTO.getMovementType();
        if (type == MovementType.ENTRY) {
            pService.increaseStock(p, DTO.getQuantity());
        } else if (type == MovementType.EXIT) {
            pService.decreaseProduct(p, DTO.getQuantity());
        } else {
            throw new RuntimeException("Escolha um tipo válido de movimento");
        }
        StockMovement movement = new StockMovement();
        movement.setProduct(p);
        movement.setQuantity(DTO.getQuantity());
        movement.setMovementDate(DTO.getMovementDate());
        movement.setMovementType(type);
        movement.setNotes(DTO.getNotes());

        return repository.save(movement);
    }

    public List<StockMovement> getAllMovements() {
        return repository.findAll();
    }

    public StockMovement getMovementById(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Essa movimentação não existe."));
    }

    @Transactional
    public void deleteMovementById(Long id) {
        StockMovement movement = getMovementById(id);
        Product product = movement.getProduct();

        if (movement.getMovementType() == MovementType.ENTRY) {
            pService.decreaseProduct(product, movement.getQuantity());
        } else if (movement.getMovementType() == MovementType.EXIT) {
            pService.increaseStock(product, movement.getQuantity());
        }

        repository.delete(movement);
    }
}