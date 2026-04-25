package com.StockMaster.API.Service;

import com.StockMaster.API.DTO.StockMovementDTO;
import com.StockMaster.API.Exceptions.BusinessException;
import com.StockMaster.API.Exceptions.ResourceNotFoundException;
import com.StockMaster.API.Models.MovementType;
import com.StockMaster.API.Models.Product;
import com.StockMaster.API.Models.StockMovement;
import com.StockMaster.API.Repositories.StockMovementRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    public StockMovement createMovement(StockMovementDTO dto) {
        // CONSERTADO POR CODEX
        validateMovement(dto);
        Product product = pService.getProductById(dto.getProductId());
        MovementType type = dto.getMovementType();

        if (type == MovementType.ENTRY) {
            pService.increaseStock(product, dto.getQuantity());
        } else if (type == MovementType.EXIT) {
            pService.decreaseProduct(product, dto.getQuantity());
        } else {
            throw new BusinessException("Escolha um tipo válido de movimento.");
        }

        StockMovement movement = new StockMovement();
        movement.setProduct(product);
        movement.setQuantity(dto.getQuantity());
        movement.setMovementDate(dto.getMovementDate() != null ? dto.getMovementDate() : LocalDate.now());
        movement.setMovementType(type);
        movement.setNotes(dto.getNotes());

        return repository.save(movement);
        //CODEX
    }

    public List<StockMovement> getAllMovements() {
        return repository.findAll();
    }

    public StockMovement getMovementById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Essa movimentação não existe."));
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

    // CONSERTADO POR CODEX
    private void validateMovement(StockMovementDTO dto) {
        if (dto == null) {
            throw new BusinessException("Os dados da movimentação são obrigatórios.");
        }
        if (dto.getProductId() == null) {
            throw new BusinessException("O produto da movimentação é obrigatório.");
        }
        if (dto.getQuantity() == null || dto.getQuantity() <= 0) {
            throw new BusinessException("A quantidade da movimentação deve ser maior que zero.");
        }
        if (dto.getMovementType() == null) {
            throw new BusinessException("O tipo da movimentação é obrigatório.");
        }
    }
    //CODEX
}
