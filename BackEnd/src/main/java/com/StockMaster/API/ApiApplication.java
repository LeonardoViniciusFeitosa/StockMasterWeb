package com.StockMaster.API;

import com.StockMaster.API.Models.User;
import com.StockMaster.API.Service.UserService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class ApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

	// CONSERTADO POR CODEX
	@Bean
	public org.springframework.boot.CommandLineRunner seedDefaultUser(UserService userService, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userService.existsByUsername("admin")) {
				User user = new User();
				user.setUsername("admin");
				user.setDisplayName("admin");
				user.setPasswordHash(passwordEncoder.encode("admin"));
				userService.save(user);
			}
		};
	}
	//CODEX

}
