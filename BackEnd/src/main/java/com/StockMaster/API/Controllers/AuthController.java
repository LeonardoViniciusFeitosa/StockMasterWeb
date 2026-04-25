package com.StockMaster.API.Controllers;

import com.StockMaster.API.DTO.LoginRequestDTO;
import com.StockMaster.API.DTO.UserDTO;
import com.StockMaster.API.Service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public UserDTO login(@RequestBody LoginRequestDTO dto, HttpServletResponse response) {
        // CONSERTADO POR CODEX
        String token = authService.login(dto);
        Cookie cookie = authService.buildSessionCookie(token);
        response.addCookie(cookie);
        return authService.getAuthenticatedUser(token);
        //CODEX
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String token = extractSessionToken(request);
        authService.logout(token);
        response.addCookie(authService.buildLogoutCookie());
    }

    @GetMapping("/me")
    public UserDTO me(HttpServletRequest request) {
        return authService.getAuthenticatedUser(extractSessionToken(request));
    }

    private String extractSessionToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }

        for (Cookie cookie : cookies) {
            if (AuthService.SESSION_COOKIE_NAME.equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
