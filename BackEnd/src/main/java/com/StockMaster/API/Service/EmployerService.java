package com.StockMaster.API.Service;

import com.StockMaster.API.Exceptions.BusinessException;
import com.StockMaster.API.Exceptions.ResourceNotFoundException;
import com.StockMaster.API.Models.Employer;
import com.StockMaster.API.Repositories.EmployerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployerService {
    private final EmployerRepository repository;

    public EmployerService(EmployerRepository repository) {
        this.repository = repository;
    }

    public Employer createEmployer(Employer employer) {
        // CONSERTADO POR CODEX
        validateEmployer(employer);
        return repository.save(employer);
        //CODEX
    }

    public List<Employer> getAllEmployers() {
        return repository.findAll();
    }

    public Employer getEmployerById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionário não encontrado."));
    }

    public Employer updateEmployerById(Long id, Employer updatedEmployer) {
        // CONSERTADO POR CODEX
        validateEmployer(updatedEmployer);
        Employer employer = getEmployerById(id);
        employer.setName(updatedEmployer.getName());
        employer.setPersonalId(updatedEmployer.getPersonalId());
        employer.setAddress(updatedEmployer.getAddress());
        employer.setPhoneNumber(updatedEmployer.getPhoneNumber());
        employer.setEmail(updatedEmployer.getEmail());
        employer.setRole(updatedEmployer.getRole());
        employer.setNotes(updatedEmployer.getNotes());

        return repository.save(employer);
        //CODEX
    }

    public void deleteEmployerById(Long id) {
        Employer employer = getEmployerById(id);
        repository.delete(employer);
    }

    // CONSERTADO POR CODEX
    private void validateEmployer(Employer employer) {
        if (employer == null) {
            throw new BusinessException("Os dados do funcionário são obrigatórios.");
        }
        if (isBlank(employer.getName())) {
            throw new BusinessException("O nome do funcionário é obrigatório.");
        }
        if (isBlank(employer.getPersonalId())) {
            throw new BusinessException("O CPF do funcionário é obrigatório.");
        }
        if (isBlank(employer.getAddress())) {
            throw new BusinessException("O endereço do funcionário é obrigatório.");
        }
        if (isBlank(employer.getPhoneNumber())) {
            throw new BusinessException("O telefone do funcionário é obrigatório.");
        }
        if (isBlank(employer.getEmail())) {
            throw new BusinessException("O email do funcionário é obrigatório.");
        }
        if (isBlank(employer.getRole())) {
            throw new BusinessException("O cargo do funcionário é obrigatório.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
    //CODEX
}
