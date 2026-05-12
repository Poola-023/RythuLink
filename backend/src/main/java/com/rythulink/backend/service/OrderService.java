package com.rythulink.backend.service;

import com.rythulink.backend.model.Order;

import java.util.List;

public interface OrderService {

    Order placeOrder(Order order);

    List<Order> getAllOrders();

    List<Order> getBuyerOrders(String buyerId);

    List<Order> getFarmerOrders(String farmerId);

    Order updateOrderStatus(String orderId, String status);
}