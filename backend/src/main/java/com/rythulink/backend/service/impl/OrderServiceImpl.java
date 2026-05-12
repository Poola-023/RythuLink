package com.rythulink.backend.service.impl;

import com.rythulink.backend.model.Crop;
import com.rythulink.backend.model.Order;
import com.rythulink.backend.repository.CropRepository;
import com.rythulink.backend.repository.OrderRepository;
import com.rythulink.backend.service.OrderService;
import com.rythulink.backend.util.IdGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CropRepository cropRepository;

    @Override
    public Order placeOrder(Order order) {

        Crop crop = cropRepository.findById(order.getCropId())
                .orElseThrow(() -> new RuntimeException("Crop Not Found"));

        if (order.getOrderQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        if (order.getOrderQuantity() > crop.getQuantity()) {
            throw new RuntimeException("Not enough crop quantity available");
        }

        order.setOrderId(IdGenerator.generateOrderId());
        order.setCropName(crop.getCropName());
        order.setFarmerId(crop.getFarmerId());
        order.setFarmerName(crop.getFarmerName());
        order.setFarmerPhone(crop.getFarmerPhone());
        order.setPricePerKg(crop.getPrice());
        order.setTotalAmount(order.getOrderQuantity() * crop.getPrice());
        order.setStatus("PENDING");

        crop.setQuantity(crop.getQuantity() - order.getOrderQuantity());
        cropRepository.save(crop);

        return orderRepository.save(order);
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public List<Order> getBuyerOrders(String buyerId) {
        return orderRepository.findByBuyerId(buyerId);
    }

    @Override
    public List<Order> getFarmerOrders(String farmerId) {
        return orderRepository.findByFarmerId(farmerId);
    }

    @Override
    public Order updateOrderStatus(String orderId, String status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order Not Found"));

        order.setStatus(status);

        return orderRepository.save(order);
    }
}