package com.rythulink.backend.controller;
import com.rythulink.backend.model.CropPlanProgress;
import com.rythulink.backend.repository.CropPlanProgressRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crop-plan-progress")
@CrossOrigin(origins = "http://localhost:5173")
public class CropPlanProgressController {

    private final CropPlanProgressRepository progressRepository;

    public CropPlanProgressController(CropPlanProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    @GetMapping("/{cropId}/{farmerId}")
    public List<CropPlanProgress> getProgress(
            @PathVariable String cropId,
            @PathVariable String farmerId
    ) {
        return progressRepository.findByCropIdAndFarmerId(cropId, farmerId);
    }

    @PostMapping("/toggle")
    public CropPlanProgress toggleProgress(@RequestBody Map<String, Object> request) {
        String cropId = request.get("cropId").toString();
        String farmerId = request.get("farmerId").toString();
        String taskId = request.get("taskId").toString();
        boolean completed = Boolean.parseBoolean(request.get("completed").toString());

        CropPlanProgress progress = progressRepository
                .findByCropIdAndFarmerIdAndTaskId(cropId, farmerId, taskId)
                .orElse(new CropPlanProgress(cropId, farmerId, taskId, completed));

        progress.setCompleted(completed);

        return progressRepository.save(progress);
    }
}
