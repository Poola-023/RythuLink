package com.rythulink.backend.repository;

import com.rythulink.backend.model.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, String> {

    Optional<Buyer> findByEmail(String email);
}