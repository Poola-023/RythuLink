package com.rythulink.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rythulink.backend.model.CropPlanProgress;

import java.util.List;
import java.util.Optional;

public interface CropPlanProgressRepository extends JpaRepository<CropPlanProgress, Long> {

    List<CropPlanProgress> findByCropIdAndFarmerId(String cropId, String farmerId);

    Optional<CropPlanProgress> findByCropIdAndFarmerIdAndTaskId(
            String cropId,
            String farmerId,
            String taskId
    );
}
