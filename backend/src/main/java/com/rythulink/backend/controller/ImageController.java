package com.rythulink.backend.controller;

import com.rythulink.backend.service.ImageUploadService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")

@RequiredArgsConstructor

public class ImageController {

    private final ImageUploadService imageUploadService;

    @PostMapping("/upload")

    public String uploadImage(

            @RequestParam("file")
            MultipartFile file
    ) {

        return imageUploadService
                .uploadImage(file);
    }
}