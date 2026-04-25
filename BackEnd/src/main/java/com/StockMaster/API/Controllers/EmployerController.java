package com.StockMaster.API.Controllers;

import com.StockMaster.API.Models.Employer;
import com.StockMaster.API.Service.EmployerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employer")
public class EmployerController {
    private final EmployerService service;

    public EmployerController(EmployerService service) {
        this.service = service;
    }

    @PostMapping
    public Employer createEmployer(@RequestBody Employer employer) {
        return service.createEmployer(employer);
    }

    @GetMapping
    public List<Employer> getAll() {
        return service.getAllEmployers();
    }

    @GetMapping("/{id}")
    public Employer getEmployerById(@PathVariable Long id) {
        return service.getEmployerById(id);
    }

    // CONSERTADO POR CODEX
    @PutMapping("/{id}")
    public Employer updateEmployer(@PathVariable Long id, @RequestBody Employer employer) {
        return service.updateEmployerById(id, employer);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployer(@PathVariable Long id) {
        service.deleteEmployerById(id);
    }
    //CODEX
}
