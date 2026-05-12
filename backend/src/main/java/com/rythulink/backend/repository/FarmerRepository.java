package com.rythulink.backend.repository;

import com.rythulink.backend.model.Farmer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FarmerRepository
        extends JpaRepository<Farmer, String> {

    Optional<Farmer> findByEmail(String email);

    Optional<Farmer> findByFarmerId(String farmerId);
}