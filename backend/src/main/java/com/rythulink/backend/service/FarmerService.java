package com.rythulink.backend.service;

import com.rythulink.backend.model.Farmer;

public interface FarmerService {

    /*
      Register Farmer
    */

    Farmer registerFarmer(Farmer farmer);

    /*
      Login Farmer
    */

    Farmer loginFarmer(
            String email,
            String password
    );
}