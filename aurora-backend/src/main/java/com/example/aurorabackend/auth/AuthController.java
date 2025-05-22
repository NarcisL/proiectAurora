package com.example.aurorabackend.auth;

import com.example.aurorabackend.user.dto.LoginRequest;
import com.example.aurorabackend.user.dto.JwtResponse;
import com.example.aurorabackend.security.JwtUtil;
import com.example.aurorabackend.user.User; // Your User entity
import com.example.aurorabackend.user.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService; // Used to ensure we get the full User object if needed

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          UserDetailsServiceImpl userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            // It's often better to return a generic error for security reasons
            return ResponseEntity.status(401).body("Error: Incorrect username or password!");
        }

        // If authentication was successful
        UserDetails userDetailsPrincipal = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtil.generateTokenFromUsername(userDetailsPrincipal.getUsername());

        // Attempt to get the full User entity.
        // If your UserDetails implementation IS your User class, this cast is direct.
        // Otherwise, reloading might be necessary if UserDetails is a wrapper.
        User userEntity = null;
        if (userDetailsPrincipal instanceof User) {
            userEntity = (User) userDetailsPrincipal;
        } else {
            // This case might occur if UserDetails is a different class.
            // Reloading ensures we have the User object with all fields like id and email.
            UserDetails loadedUserDetails = userDetailsService.loadUserByUsername(userDetailsPrincipal.getUsername());
            if (loadedUserDetails instanceof User) {
                userEntity = (User) loadedUserDetails;
            }
        }

        List<String> roles = userDetailsPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        if (userEntity != null) {
            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userEntity.getId(), // Now correctly passes String ID
                    userEntity.getUsername(), // Or userDetailsPrincipal.getUsername()
                    userEntity.getEmail(),
                    roles
            ));
        } else {
            JwtResponse simpleResponse = new JwtResponse(jwt, userDetailsPrincipal.getUsername());
            simpleResponse.setRoles(roles); // Roles are available from UserDetails principal

            return ResponseEntity.ok(simpleResponse);
        }
    }
}