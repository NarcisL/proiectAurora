package com.example.aurorabackend.auth;

import com.example.aurorabackend.user.User;
import com.example.aurorabackend.user.UserRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class TokenCleanupService {
    private final VerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;

    public TokenCleanupService(VerificationTokenRepository tokenRepository, UserRepository userRepository) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }

    @Scheduled(fixedRate = 60 * 60 * 1000)
    public void cleanupExpiredTokensAndUsers() {
        List<VerificationToken> expiredTokens = tokenRepository.findAll().stream()
                .filter(token -> token.getExpiryDate().before(new Date()))
                .toList();

        for (VerificationToken token : expiredTokens) {
            User user = userRepository.findById(token.getUserId()).orElse(null);
            if (user != null && !user.isEnabled()) {
                userRepository.delete(user);
            }
            tokenRepository.delete(token);
        }
    }
}