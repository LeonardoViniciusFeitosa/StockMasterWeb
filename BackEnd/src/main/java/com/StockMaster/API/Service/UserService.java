package com.StockMaster.API.Service;

import com.StockMaster.API.DTO.UserDTO;
import com.StockMaster.API.Exceptions.ResourceNotFoundException;
import com.StockMaster.API.Models.User;
import com.StockMaster.API.Repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public User getUserByUsername(String username) {
        return repository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }

    public boolean existsByUsername(String username) {
        return repository.findByUsername(username).isPresent();
    }

    public User save(User user) {
        return repository.save(user);
    }

    public UserDTO toDTO(User user) {
        return new UserDTO(user.getId(), user.getUsername(), user.getDisplayName());
    }
}
