package com.StockMaster.API.Repositories;

import com.StockMaster.API.Models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
