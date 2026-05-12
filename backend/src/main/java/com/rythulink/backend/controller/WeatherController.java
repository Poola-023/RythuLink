package com.rythulink.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Value("${openweather.api.key}")
    private String apiKey;

    @GetMapping("/{city}")
    public ResponseEntity<?> getWeather(
            @PathVariable String city
    ) {

        try {

            if (apiKey == null || apiKey.isBlank()) {
                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("OpenWeather API key is missing");
            }

            String encodedCity =
                    URLEncoder.encode(
                            city,
                            StandardCharsets.UTF_8
                    );

            String url =
                    "https://api.openweathermap.org/data/2.5/weather?q="
                            + encodedCity
                            + ",IN"
                            + "&appid="
                            + apiKey
                            + "&units=metric";

            RestTemplate restTemplate =
                    new RestTemplate();

            String response =
                    restTemplate.getForObject(
                            url,
                            String.class
                    );

            return ResponseEntity.ok(response);

        } catch (HttpClientErrorException e) {

            return ResponseEntity
                    .status(e.getStatusCode())
                    .body(e.getResponseBodyAsString());

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Weather API failed: " + e.getMessage());
        }
    }
}