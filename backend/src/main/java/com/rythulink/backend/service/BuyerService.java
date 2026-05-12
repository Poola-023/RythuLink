package com.rythulink.backend.service;

import com.rythulink.backend.model.Buyer;

public interface BuyerService {

    Buyer registerBuyer(Buyer buyer);

    Buyer loginBuyer(String email, String password);
}