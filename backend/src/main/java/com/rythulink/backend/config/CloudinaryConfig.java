package com.rythulink.backend.config;

import com.cloudinary.Cloudinary;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {

        Map<String, String> config =
                new HashMap<>();

        config.put("cloud_name", "dabnpwwg7");

        config.put("api_key", "628124783984712");

        config.put("api_secret", "rwmEbYRsH_I0c9WJGcAADNZ0YdI");

        return new Cloudinary(config);
    }
}