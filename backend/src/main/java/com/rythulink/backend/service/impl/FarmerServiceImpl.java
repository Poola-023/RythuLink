package com.rythulink.backend.service.impl;

import com.rythulink.backend.model.Farmer;
import com.rythulink.backend.repository.FarmerRepository;
import com.rythulink.backend.service.FarmerService;
import com.rythulink.backend.util.IdGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FarmerServiceImpl implements FarmerService {

    @Autowired
    private FarmerRepository farmerRepository;

    @Override
    public Farmer registerFarmer(Farmer farmer) {

        /*
         Generate Farmer ID
         Example:
         FMR20260512345
        */

        farmer.setFarmerId(
                IdGenerator.generateFarmerId()
        );

        return farmerRepository.save(farmer);
    }

    @Override
    public Farmer loginFarmer(String email, String password) {

        Optional<Farmer> optionalFarmer =
                farmerRepository.findByEmail(email);

        if (optionalFarmer.isPresent()) {

            Farmer farmer =
                    optionalFarmer.get();

            if (
                    farmer.getPassword()
                            .equals(password)
            ) {

                return farmer;
            }
        }

        return null;
    }
}