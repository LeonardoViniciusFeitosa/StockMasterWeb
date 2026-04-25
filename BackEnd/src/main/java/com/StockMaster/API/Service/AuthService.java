package com.StockMaster.API.Service;

import com.StockMaster.API.DTO.LoginRequestDTO;
import com.StockMaster.API.DTO.UserDTO;
import com.StockMaster.API.Exceptions.BusinessException;
import com.StockMaster.API.Exceptions.ResourceNotFoundException;
import com.StockMaster.API.Models.User;
import jakarta.servlet.http.Cookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {
    public static final String SESSION_COOKIE_NAME = "stockmaster_session";

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, String> sessions = new ConcurrentHashMap<>();

    public AuthService(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // CONSERTADO POR CODEX
    public String login(LoginRequestDTO dto) {
        if (dto == null || isBlank(dto.getUsername()) || isBlank(dto.getPassword())) {
            throw new BusinessException("Usuário e senha são obrigatórios.");
        }

        User user = userService.getUserByUsername(dto.getUsername().trim());

        if (!passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            throw new BusinessException("Usuário ou senha inválidos.");
        }

        String token = generateSessionToken();
        sessions.put(token, user.getUsername());
        return token;
    }

    public void logout(String token) {
        if (token != null) {
            sessions.remove(token);
        }
    }

    public UserDTO getAuthenticatedUser(String token) {
        if (token == null || token.isBlank()) {
            throw new ResourceNotFoundException("Sessão não encontrada.");
        }

        String username = sessions.get(token);
        if (username == null) {
            throw new ResourceNotFoundException("Sessão inválida.");
        }

        return userService.toDTO(userService.getUserByUsername(username));
    }

    public User requireAuthenticatedUser(String token) {
        if (token == null || token.isBlank()) {
            throw new BusinessException("Acesso não autorizado.");
        }

        String username = sessions.get(token);
        if (username == null) {
            throw new BusinessException("Acesso não autorizado.");
        }

        return userService.getUserByUsername(username);
    }

    public Cookie buildSessionCookie(String token) {
        Cookie cookie = new Cookie(SESSION_COOKIE_NAME, token);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 8);
        return cookie;
    }

    public Cookie buildLogoutCookie() {
        Cookie cookie = new Cookie(SESSION_COOKIE_NAME, "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        return cookie;
    }

    private String generateSessionToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
    //CODEX
}
