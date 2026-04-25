package com.StockMaster.API.Service;

import com.StockMaster.API.Exceptions.BusinessException;
import com.StockMaster.API.Exceptions.ResourceNotFoundException;
import com.StockMaster.API.Models.Customer;
import com.StockMaster.API.Repositories.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public Customer createCustomer(Customer customer) {
        // CONSERTADO POR CODEX
        validateCustomer(customer);
        return repository.save(customer);
        //CODEX
    }

    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    public Customer getCustomerById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado."));
    }

    public Customer updateCustomerById(Long id, Customer updatedCustomer) {
        // CONSERTADO POR CODEX
        validateCustomer(updatedCustomer);
        Customer customer = getCustomerById(id);
        customer.setAddress(updatedCustomer.getAddress());
        customer.setEmail(updatedCustomer.getEmail());
        customer.setName(updatedCustomer.getName());
        customer.setNotes(updatedCustomer.getNotes());
        customer.setPersonalId(updatedCustomer.getPersonalId());
        customer.setPhoneNumber(updatedCustomer.getPhoneNumber());

        return repository.save(customer);
        //CODEX
    }

    public void deleteCustomerById(Long id) {
        Customer customer = getCustomerById(id);
        repository.delete(customer);
    }

    // CONSERTADO POR CODEX
    private void validateCustomer(Customer customer) {
        if (customer == null) {
            throw new BusinessException("Os dados do cliente são obrigatórios.");
        }
        if (isBlank(customer.getName())) {
            throw new BusinessException("O nome do cliente é obrigatório.");
        }
        if (isBlank(customer.getPersonalId())) {
            throw new BusinessException("O CPF/CNPJ do cliente é obrigatório.");
        }
        if (isBlank(customer.getAddress())) {
            throw new BusinessException("O endereço do cliente é obrigatório.");
        }
        if (isBlank(customer.getPhoneNumber())) {
            throw new BusinessException("O telefone do cliente é obrigatório.");
        }
        if (isBlank(customer.getEmail())) {
            throw new BusinessException("O email do cliente é obrigatório.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
    //CODEX
}
