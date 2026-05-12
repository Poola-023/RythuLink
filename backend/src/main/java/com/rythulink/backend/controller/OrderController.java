package com.rythulink.backend.controller;

import com.rythulink.backend.model.Order;
import com.rythulink.backend.service.OrderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public Order placeOrder(@RequestBody Order order) {
        return orderService.placeOrder(order);
    }

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/buyer/{buyerId}")
    public List<Order> getBuyerOrders(@PathVariable String buyerId) {
        return orderService.getBuyerOrders(buyerId);
    }

    @GetMapping("/farmer/{farmerId}")
    public List<Order> getFarmerOrders(@PathVariable String farmerId) {
        return orderService.getFarmerOrders(farmerId);
    }

    @PutMapping("/{orderId}/status/{status}")
    public Order updateOrderStatus(
            @PathVariable String orderId,
            @PathVariable String status
    ) {
        return orderService.updateOrderStatus(orderId, status);
    }
}