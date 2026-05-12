package com.rythulink.backend.service.impl;

import com.rythulink.backend.model.Buyer;
import com.rythulink.backend.repository.BuyerRepository;
import com.rythulink.backend.service.BuyerService;
import com.rythulink.backend.util.IdGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class BuyerServiceImpl implements BuyerService {

    @Autowired
    private BuyerRepository buyerRepository;

    @Override
    public Buyer registerBuyer(Buyer buyer) {

        buyer.setBuyerId(
                IdGenerator.generateBuyerId()
        );

        return buyerRepository.save(buyer);
    }

    @Override
    public Buyer loginBuyer(String email, String password) {

        Optional<Buyer> optionalBuyer =
                buyerRepository.findByEmail(email);

        if (optionalBuyer.isPresent()) {

            Buyer buyer =
                    optionalBuyer.get();

            if (buyer.getPassword().equals(password)) {
                return buyer;
            }
        }

        return null;
    }
}