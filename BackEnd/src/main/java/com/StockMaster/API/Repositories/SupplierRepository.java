package com.StockMaster.API.Repositories;

import com.StockMaster.API.Models.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}
