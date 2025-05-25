package com.example.aurorabackend.auth;

import com.example.aurorabackend.user.User;
import com.example.aurorabackend.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.Random;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository tokenRepository;
    private final JavaMailSender mailSender;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           VerificationTokenRepository tokenRepository,
                           JavaMailSender mailSender) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
        this.mailSender = mailSender;
    }

    @Override
    public User register(RegisterRequest request) {
        if (!StringUtils.hasText(request.getUsername()) ||
                !StringUtils.hasText(request.getEmail()) ||
                !StringUtils.hasText(request.getPassword())) {
            throw new IllegalArgumentException("Username, email, and password are required.");
        }

        String username = request.getUsername().trim();
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.findByUsername(username).isPresent()) {
            throw new DuplicateKeyException("Username '" + username + "' already exists.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateKeyException("Email '" + email + "' already exists.");
        }

        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEnabled(false);

        User savedUser = userRepository.save(user);


        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUserId(savedUser.getId());
        verificationToken.setExpiryDate(new Date(System.currentTimeMillis() + 5 * 60 * 1000));
        VerificationToken savedToken = tokenRepository.save(verificationToken);
        System.out.println("Saved token: " + savedToken.getToken());

        String confirmationUrl = "http://localhost:4200/confirm?token=" + token;
        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(savedUser.getEmail());
        emailMessage.setSubject("Confirm your email");
        emailMessage.setText("Click the link to confirm your email: " + confirmationUrl);
        mailSender.send(emailMessage);

        return savedUser;
    }

    public void send2FACode(User user) {
        String code = String.format("%06d", new Random().nextInt(999999));
        user.setTwoFactorCode(code);
        user.setTwoFactorExpiry(new Date(System.currentTimeMillis() + 5 * 60 * 1000)); // 5 min
        userRepository.save(user);

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(user.getEmail());
        email.setSubject("Your 2FA Code");
        email.setText("Your two-factor authentication code is: " + code);
        mailSender.send(email);
    }

}