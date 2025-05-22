package com.example.aurorabackend.user;

import com.example.aurorabackend.user.dto.UserUpdateRequest; // Import the new DTO

public interface UserService {
    User registerUser(User user) throws Exception;
    void deleteUser(String userId);
    User updateUser(String userId, UserUpdateRequest updateRequest); // Add this line
}