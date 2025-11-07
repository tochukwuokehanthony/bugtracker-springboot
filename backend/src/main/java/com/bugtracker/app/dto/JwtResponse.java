package com.bugtracker.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String authorityLevel;

    public JwtResponse(String token, Long id, String email, String firstName, String lastName, String authorityLevel) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.authorityLevel = authorityLevel;
    }
}