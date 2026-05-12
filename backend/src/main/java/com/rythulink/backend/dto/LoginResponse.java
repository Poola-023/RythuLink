package com.rythulink.backend.dto;

public class LoginResponse {

    private String token;

    private String farmerId;

    private String name;

    private String email;

    public LoginResponse() {
    }

    public LoginResponse(
            String token,
            String farmerId,
            String name,
            String email
    ) {

        this.token = token;
        this.farmerId = farmerId;
        this.name = name;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}