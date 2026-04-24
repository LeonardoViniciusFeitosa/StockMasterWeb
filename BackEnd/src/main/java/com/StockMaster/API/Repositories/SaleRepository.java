package com.StockMaster.API.Repositories;

import com.StockMaster.API.Models.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}
