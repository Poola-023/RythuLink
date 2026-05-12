package com.rythulink.backend.controller;

import com.rythulink.backend.dto.BuyerLoginResponse;
import com.rythulink.backend.dto.LoginRequest;
import com.rythulink.backend.model.Buyer;
import com.rythulink.backend.service.BuyerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/buyers")
public class BuyerController {

    @Autowired
    private BuyerService buyerService;

    @PostMapping("/register")
    public ResponseEntity<?> registerBuyer(
            @RequestBody Buyer buyer
    ) {

        Buyer savedBuyer =
                buyerService.registerBuyer(buyer);

        return ResponseEntity.ok(savedBuyer);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginBuyer(
            @RequestBody LoginRequest request
    ) {

        Buyer buyer =
                buyerService.loginBuyer(
                        request.getEmail(),
                        request.getPassword()
                );

        if (buyer == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid Buyer Credentials");
        }

        String token =
                "BUYER_TOKEN_" + buyer.getBuyerId();

        BuyerLoginResponse response =
                new BuyerLoginResponse(
                        token,
                        buyer.getBuyerId(),
                        buyer.getBuyerName(),
                        buyer.getEmail()
                );

        return ResponseEntity.ok(response);
    }
}