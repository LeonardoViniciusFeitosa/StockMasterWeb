package com.StockMaster.API.Controllers;

import com.StockMaster.API.DTO.StockMovementDTO;
import com.StockMaster.API.Models.StockMovement;
import com.StockMaster.API.Service.StockMovementService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stockMovement")
public class StockMovementController {
    private final StockMovementService service;

    public StockMovementController(StockMovementService service) {
        this.service = service;
    }

    @PostMapping
    public StockMovement createMovement(@RequestBody StockMovementDTO dto) {
        return service.createMovement(dto);
    }

    @GetMapping
    public List<StockMovement> getALlMovements() {
        return service.getAllMovements();
    }

    @GetMapping("/{id}")
    public StockMovement GetMovement(@PathVariable Long id) {
        return service.getMovementById(id);
    }

    @DeleteMapping("/{id}")
    public void DeleteMovement(@PathVariable Long id) {
        service.deleteMovementById(id);
    }
}
