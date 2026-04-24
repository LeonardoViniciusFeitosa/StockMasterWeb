package com.StockMaster.API.Repositories;

import com.StockMaster.API.Models.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
}
