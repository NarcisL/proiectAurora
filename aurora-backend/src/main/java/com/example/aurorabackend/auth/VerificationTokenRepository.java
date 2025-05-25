package com.example.aurorabackend.auth;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationTokenRepository extends MongoRepository<VerificationToken,String>{
    public VerificationToken findByToken(String token);
}