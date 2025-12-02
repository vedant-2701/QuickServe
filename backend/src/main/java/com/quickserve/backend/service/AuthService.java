package com.quickserve.backend.service;

import com.quickserve.backend.dto.request.LoginRequest;
import com.quickserve.backend.dto.request.SignupRequest;
import com.quickserve.backend.dto.response.AuthResponse;

public interface AuthService {
    
    AuthResponse login(LoginRequest request);
    
    AuthResponse signup(SignupRequest request);
    
    AuthResponse refreshToken(String refreshToken);
    
    void logout(String email);
}
