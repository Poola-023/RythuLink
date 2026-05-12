package com.rythulink.backend.service;

import com.rythulink.backend.model.Crop;

import java.util.List;

public interface CropService {

    Crop addCrop(Crop crop);

    List<Crop> getAllCrops();

    List<Crop> getCropsByFarmerId(String farmerId);

    Crop updateCrop(String cropId, Crop crop);

    void deleteCrop(String cropId);
}