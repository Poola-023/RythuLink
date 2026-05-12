package com.rythulink.backend.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class AdminStatsDTO {

    private Long totalUsers;

    private Long totalCrops;

    private Long totalOrders;
}