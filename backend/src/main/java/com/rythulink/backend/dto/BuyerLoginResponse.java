package com.rythulink.backend.dto;

public class BuyerLoginResponse {

    private String token;

    private String buyerId;

    private String buyerName;

    private String email;

    public BuyerLoginResponse() {
    }

    public BuyerLoginResponse(
            String token,
            String buyerId,
            String buyerName,
            String email
    ) {
        this.token = token;
        this.buyerId = buyerId;
        this.buyerName = buyerName;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public String getBuyerId() {
        return buyerId;
    }

    public String getBuyerName() {
        return buyerName;
    }

    public String getEmail() {
        return email;
    }
}