package com.example.aurorabackend.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Document(collection = "users") // Specifies the MongoDB collection name
public class User implements UserDetails { // Implement UserDetails

    @Id
    private String id; // MongoDB typically uses String for ObjectId

    @Indexed(unique = true) // Ensures username is unique
    private String username;

    @Indexed(unique = true) // Ensures email is unique
    private String email;

    private String password; // Will store the hashed password

    private boolean isAdmin;
    private int dragonCoins;
    private int dragonTokens;

    // Constructors
    public User() {
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.dragonCoins = 0;
        this.dragonTokens = 0;
        this.isAdmin = false; // Default to not admin
    }

    // Getters and Setters for existing fields
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    // username getter is part of UserDetails
    // email getter is standard
    // password getter is part of UserDetails

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public int getDragonCoins() {
        return dragonCoins;
    }

    public void setDragonCoins(int dragonCoins) {
        this.dragonCoins = dragonCoins;
    }

    public int getDragonTokens() {
        return dragonTokens;
    }

    public void setDragonTokens(int dragonTokens) {
        this.dragonTokens = dragonTokens;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // UserDetails methods implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();
        if (this.isAdmin) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        } else {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER")); // Default role
        }
        // You can add more roles here if needed based on other fields/logic
        return authorities;
    }

    @Override
    public String getPassword() { // From UserDetails
        return this.password;
    }

    @Override
    public String getUsername() { // From UserDetails
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // Or add logic if accounts can expire
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // Or add logic if accounts can be locked
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Or add logic if credentials can expire
    }

    @Override
    public boolean isEnabled() {
        return true; // Or add logic for account activation (e.g., email verification)
    }

    // equals, hashCode, toString
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return isAdmin == user.isAdmin &&
                dragonCoins == user.dragonCoins &&
                dragonTokens == user.dragonTokens &&
                Objects.equals(id, user.id) &&
                Objects.equals(username, user.username) &&
                Objects.equals(email, user.email); // Password excluded for security in general equals
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username, email, isAdmin, dragonCoins, dragonTokens); // Password excluded
    }

    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", isAdmin=" + isAdmin +
                ", dragonCoins=" + dragonCoins +
                ", dragonTokens=" + dragonTokens +
                '}'; // Password excluded from toString for security
    }
}