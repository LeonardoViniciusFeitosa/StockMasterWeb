package com.StockMaster.API.Repositories;

import com.StockMaster.API.Models.Employer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployerRepository extends JpaRepository<Employer, Long> {
}
