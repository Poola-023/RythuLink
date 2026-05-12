package com.rythulink.backend.repository;

import com.rythulink.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findByBuyerId(String buyerId);

    List<Order> findByFarmerId(String farmerId);
}