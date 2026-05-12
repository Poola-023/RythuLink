package com.rythulink.backend.controller;

import com.rythulink.backend.dto.LoginRequest;
import com.rythulink.backend.dto.LoginResponse;
import com.rythulink.backend.dto.RegisterRequest;
import com.rythulink.backend.model.Farmer;
import com.rythulink.backend.service.FarmerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private FarmerService farmerService;

    /*
      REGISTER FARMER
    */

    @PostMapping("/register")
    public ResponseEntity<?> registerFarmer(
            @RequestBody RegisterRequest request
    ) {

        Farmer farmer =
                new Farmer();

        farmer.setName(
                request.getName()
        );

        farmer.setEmail(
                request.getEmail()
        );

        farmer.setPassword(
                request.getPassword()
        );

        farmer.setPhone(
                request.getPhone()
        );

        farmer.setVillage(
                request.getVillage()
        );

        Farmer savedFarmer =
                farmerService.registerFarmer(farmer);

        return ResponseEntity.ok(savedFarmer);
    }

    /*
      LOGIN FARMER
    */

    @PostMapping("/login")
    public ResponseEntity<?> loginFarmer(
            @RequestBody LoginRequest request
    ) {

        Farmer farmer =
                farmerService.loginFarmer(

                        request.getEmail(),

                        request.getPassword()
                );

        if (farmer == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid Credentials");
        }

        /*
          TEMP TOKEN
        */

        String token =
                "RYTHU_TOKEN_" +
                        farmer.getFarmerId();

        LoginResponse response =
                new LoginResponse(

                        token,

                        farmer.getFarmerId(),

                        farmer.getName(),

                        farmer.getEmail()
                );

        return ResponseEntity.ok(response);
    }
}