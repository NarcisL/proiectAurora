package com.example.aurorabackend.auth;

import com.example.aurorabackend.dto.LoginRequest;
import com.example.aurorabackend.user.User;

public interface AuthService {
    User register(RegisterRequest request);

    void send2FACode(User user);
}
