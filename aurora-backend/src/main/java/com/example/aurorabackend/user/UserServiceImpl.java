package com.example.aurorabackend.user;

import com.example.aurorabackend.user.dto.UserUpdateRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    final UserRepository userRepository; // Made final as it's set in constructor
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User registerUser(User user) throws Exception {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty() ||
                user.getEmail() == null || user.getEmail().trim().isEmpty() ||
                user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Username, email, and password are required.");
        }

        user.setUsername(user.getUsername().trim());
        user.setEmail(user.getEmail().trim().toLowerCase());

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new DuplicateKeyException("Username already exists.");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new DuplicateKeyException("Email already exists.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(String userId) {
        if (!userRepository.existsById(userId)) {
            throw new UsernameNotFoundException("User not found with the id " + userId);
        }
        userRepository.deleteById(userId);
    }

    @Override
    public User updateUser(String userId, UserUpdateRequest updateRequest) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + userId));

        if (StringUtils.hasText(updateRequest.getEmail()) && !existingUser.getEmail().equalsIgnoreCase(updateRequest.getEmail())) {
            String newEmail = updateRequest.getEmail().trim().toLowerCase();
            if (userRepository.findByEmail(newEmail).isPresent() && !userRepository.findByEmail(newEmail).get().getId().equals(userId)) {
                throw new DuplicateKeyException("Email address " + newEmail + " is already in use.");
            }
            existingUser.setEmail(newEmail);
        }

        return userRepository.save(existingUser);
    }
}