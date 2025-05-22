package com.example.aurorabackend.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> { // ID type is now String
    // Custom query methods for checking existence
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}