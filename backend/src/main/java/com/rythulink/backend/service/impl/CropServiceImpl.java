package com.rythulink.backend.service.impl;

import com.rythulink.backend.model.Crop;
import com.rythulink.backend.repository.CropRepository;
import com.rythulink.backend.service.CropService;
import com.rythulink.backend.util.IdGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropServiceImpl implements CropService {

    @Autowired
    private CropRepository cropRepository;

    @Override
    public Crop addCrop(Crop crop) {

        crop.setCropId(
                IdGenerator.generateCropId()
        );

        return cropRepository.save(crop);
    }

    @Override
    public List<Crop> getAllCrops() {
        return cropRepository.findAll();
    }

    @Override
    public List<Crop> getCropsByFarmerId(String farmerId) {
        return cropRepository.findByFarmerId(farmerId);
    }

    @Override
    public Crop updateCrop(String cropId, Crop crop) {

        Crop existingCrop =
                cropRepository.findById(cropId)
                        .orElseThrow(() -> new RuntimeException("Crop Not Found"));

        existingCrop.setCropName(crop.getCropName());
        existingCrop.setQuantity(crop.getQuantity());
        existingCrop.setPrice(crop.getPrice());
        existingCrop.setLocation(crop.getLocation());
        existingCrop.setDescription(crop.getDescription());

        return cropRepository.save(existingCrop);
    }

    @Override
    public void deleteCrop(String cropId) {
        cropRepository.deleteById(cropId);
    }
}