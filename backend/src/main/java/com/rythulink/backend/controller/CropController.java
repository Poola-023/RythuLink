package com.rythulink.backend.controller;

import com.rythulink.backend.model.Crop;
import com.rythulink.backend.service.CropService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/crops")
public class CropController {

    @Autowired
    private CropService cropService;

    @PostMapping
    public Crop addCrop(@RequestBody Crop crop) {
        return cropService.addCrop(crop);
    }

    @GetMapping
    public List<Crop> getAllCrops() {
        return cropService.getAllCrops();
    }

    @GetMapping("/farmer/{farmerId}")
    public List<Crop> getFarmerCrops(@PathVariable String farmerId) {
        return cropService.getCropsByFarmerId(farmerId);
    }

    @PutMapping("/{cropId}")
    public Crop updateCrop(
            @PathVariable String cropId,
            @RequestBody Crop crop
    ) {
        return cropService.updateCrop(cropId, crop);
    }

    @DeleteMapping("/{cropId}")
    public String deleteCrop(@PathVariable String cropId) {
        cropService.deleteCrop(cropId);
        return "Crop Deleted Successfully";
    }
}