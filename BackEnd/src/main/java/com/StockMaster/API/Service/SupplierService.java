package com.StockMaster.API.Service;

import com.StockMaster.API.Exceptions.BusinessException;
import com.StockMaster.API.Exceptions.ResourceNotFoundException;
import com.StockMaster.API.Models.Supplier;
import com.StockMaster.API.Repositories.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {
    private final SupplierRepository repository;

    public SupplierService(SupplierRepository repository) {
        this.repository = repository;
    }

    public Supplier createSupplier(Supplier supplier) {
        // CONSERTADO POR CODEX
        validateSupplier(supplier);
        return repository.save(supplier);
        //CODEX
    }

    public List<Supplier> getAllSuppliers() {
        return repository.findAll();
    }

    public Supplier getSupplierById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fornecedor não encontrado."));
    }

    public Supplier updateSupplierById(Long id, Supplier updatedSupplier) {
        // CONSERTADO POR CODEX
        validateSupplier(updatedSupplier);
        Supplier supplier = getSupplierById(id);
        supplier.setAddress(updatedSupplier.getAddress());
        supplier.setEmail(updatedSupplier.getEmail());
        supplier.setName(updatedSupplier.getName());
        supplier.setNotes(updatedSupplier.getNotes());
        supplier.setPhoneNumber(updatedSupplier.getPhoneNumber());
        supplier.setTaxId(updatedSupplier.getTaxId());

        return repository.save(supplier);
        //CODEX
    }

    public void deleteSupplierById(Long id) {
        Supplier supplier = getSupplierById(id);
        repository.delete(supplier);
    }

    // CONSERTADO POR CODEX
    private void validateSupplier(Supplier supplier) {
        if (supplier == null) {
            throw new BusinessException("Os dados do fornecedor são obrigatórios.");
        }
        if (isBlank(supplier.getName())) {
            throw new BusinessException("O nome do fornecedor é obrigatório.");
        }
        if (isBlank(supplier.getTaxId())) {
            throw new BusinessException("O CNPJ do fornecedor é obrigatório.");
        }
        if (isBlank(supplier.getAddress())) {
            throw new BusinessException("O endereço do fornecedor é obrigatório.");
        }
        if (isBlank(supplier.getPhoneNumber())) {
            throw new BusinessException("O telefone do fornecedor é obrigatório.");
        }
        if (isBlank(supplier.getEmail())) {
            throw new BusinessException("O email do fornecedor é obrigatório.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
    //CODEX
}
