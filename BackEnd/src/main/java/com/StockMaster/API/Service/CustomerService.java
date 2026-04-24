package com.StockMaster.API.Service;

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

    public Customer createCustomer(Customer customer){
        return repository.save(customer);
    }

    public List<Customer> getAllCustomers(){
        return repository.findAll();
    }

    public Customer getCustomerById(Long id){
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Cliente não encontrado."));
    }

    public Customer updateCustomerById(Long id, Customer updatedCustomer){
        Customer customer = getCustomerById(id);
        customer.setAddress(updatedCustomer.getAddress());
        customer.setEmail(updatedCustomer.getEmail());
        customer.setName(updatedCustomer.getName());
        customer.setNotes(updatedCustomer.getNotes());
        customer.setPersonalId(updatedCustomer.getPersonalId());
        customer.setPhoneNumber(updatedCustomer.getPhoneNumber());

        return repository.save(customer);
    }

    public void DeleteCustomerById(Long id){
        repository.deleteById(id);
    }
}
