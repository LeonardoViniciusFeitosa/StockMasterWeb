package com.StockMaster.API.Service;

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

    public Supplier createSupplier(Supplier supplier){
        return repository.save(supplier);
    }

    public List<Supplier> getAllSuppliers(){
        return repository.findAll();
    }

    public Supplier getSupplierById(Long id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Fornecedor não encontrado."));
    }

    public Supplier updateSupplierById(Long id, Supplier updatedSupplier){
        Supplier supplier = getSupplierById(id);
        supplier.setAddress(updatedSupplier.getAddress());
        supplier.setEmail(updatedSupplier.getEmail());
        supplier.setName(updatedSupplier.getName());
        supplier.setNotes(updatedSupplier.getNotes());
        supplier.setPhoneNumber(updatedSupplier.getPhoneNumber());
        supplier.setTaxId(updatedSupplier.getTaxId());

        return repository.save(supplier);
    }

    public void deleteSupplierById(Long id){
        repository.deleteById(id);
    }
}
