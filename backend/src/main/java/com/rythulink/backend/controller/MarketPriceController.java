package com.rythulink.backend.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/market-prices")
@CrossOrigin(origins = "*")
public class MarketPriceController {

    private static final String RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
    private static final String DATA_GOV_API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    private static final List<String> VEGETABLES = Arrays.asList(
            "Tomato", "Onion", "Potato", "Brinjal", "Bhindi(Ladies Finger)",
            "Bitter gourd", "Bottle gourd", "Cabbage", "Capsicum", "Carrot",
            "Cauliflower", "Green Chilli", "Cucumbar(Kheera)", "Drumstick",
            "Pumpkin", "Raddish", "Ridgeguard(Tori)", "Snakeguard",
            "Sweet Potato", "Cluster beans", "French Beans(Frasbean)", "Beetroot",
            "Garlic", "Ginger(Green)", "Peas Wet", "Spinach", "Coriander(Leaves)",
            "Methi(Leaves)", "Mint(Pudina)", "Knool Khol", "Turnip", "Yam",
            "Colacasia", "Elephant Yam", "Ashgourd", "Little gourd", "Pointed gourd"
    );

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Spring Boot Market Price API working on 8085");
        return ResponseEntity.ok(response);
    }

    // For Home page vegetables
    @GetMapping("/vegetables")
    public ResponseEntity<?> getVegetablePrices(
            @RequestParam(defaultValue = "") String state,
            @RequestParam(defaultValue = "") String district,
            @RequestParam(defaultValue = "") String market,
            @RequestParam(defaultValue = "") String commodity,
            @RequestParam(defaultValue = "5000") int limit
    ) {
        return fetchPrices(state, district, market, commodity, limit, true);
    }

    // For FarmingProducts page: rice, wheat, pulses, spices, fruits, cotton, etc.
    @GetMapping("/products")
    public ResponseEntity<?> getAllFarmingProductPrices(
            @RequestParam(defaultValue = "") String state,
            @RequestParam(defaultValue = "") String district,
            @RequestParam(defaultValue = "") String market,
            @RequestParam(defaultValue = "") String commodity,
            @RequestParam(defaultValue = "5000") int limit
    ) {
        return fetchPrices(state, district, market, commodity, limit, false);
    }

    private ResponseEntity<?> fetchPrices(
            String state,
            String district,
            String market,
            String commodity,
            int limit,
            boolean onlyVegetables
    ) {
        try {
            int safeLimit = Math.min(Math.max(limit, 10), 5000);

            StringBuilder url = new StringBuilder(
                    "https://api.data.gov.in/resource/" + RESOURCE_ID + "?"
            );

            appendParam(url, "api-key", DATA_GOV_API_KEY);
            appendParam(url, "format", "json");
            appendParam(url, "limit", String.valueOf(safeLimit));

            if (!isBlank(state)) {
                appendFilter(url, "state", state);
            }

            if (!isBlank(district)) {
                appendFilter(url, "district", district);
            }

            if (!isBlank(market)) {
                appendFilter(url, "market", market);
            }

            if (!isBlank(commodity) && !commodity.equalsIgnoreCase("All")) {
                appendFilter(url, "commodity", commodity);
            }

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url.toString()))
                    .GET()
                    .build();

            HttpResponse<String> apiResponse = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (apiResponse.statusCode() != 200) {
                Map<String, Object> error = new HashMap<>();
                error.put("success", false);
                error.put("message", "Failed to fetch mandi prices");
                error.put("status", apiResponse.statusCode());
                error.put("error", apiResponse.body());
                return ResponseEntity.status(502).body(error);
            }

            JsonNode root = objectMapper.readTree(apiResponse.body());
            JsonNode recordsNode = root.path("records");

            List<Map<String, Object>> records = new ArrayList<>();
            int id = 1;

            if (recordsNode.isArray()) {
                for (JsonNode item : recordsNode) {
                    String itemState = text(item, "state");
                    String itemDistrict = text(item, "district");
                    String itemMarket = text(item, "market");
                    String itemCommodity = text(item, "commodity");

                    // Extra filtering in backend, so wrong state records will not come
                    if (!isBlank(state) && !same(itemState, state)) continue;
                    if (!isBlank(district) && !same(itemDistrict, district)) continue;
                    if (!isBlank(market) && !contains(itemMarket, market)) continue;

                    if (!isBlank(commodity) && !commodity.equalsIgnoreCase("All")) {
                        if (!commodityMatch(itemCommodity, commodity)) continue;
                    }

                    if (onlyVegetables && (isBlank(commodity) || commodity.equalsIgnoreCase("All"))) {
                        if (!isVegetable(itemCommodity)) continue;
                    }

                    double minPrice = toNumber(text(item, "min_price"));
                    double maxPrice = toNumber(text(item, "max_price"));
                    double modalPrice = toNumber(text(item, "modal_price"));

                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", id++);
                    row.put("state", itemState);
                    row.put("district", itemDistrict);
                    row.put("market", itemMarket);
                    row.put("commodity", itemCommodity);
                    row.put("variety", text(item, "variety"));
                    row.put("grade", text(item, "grade"));
                    row.put("arrivalDate", text(item, "arrival_date"));

                    row.put("minPrice", minPrice);
                    row.put("maxPrice", maxPrice);
                    row.put("modalPrice", modalPrice);

                    row.put("minPerKg", formatKg(minPrice));
                    row.put("maxPerKg", formatKg(maxPrice));
                    row.put("modalPerKg", formatKg(modalPrice));

                    records.add(row);
                }
            }

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("success", true);
            response.put("source", "data.gov.in / AGMARKNET");
            response.put("count", records.size());
            response.put("records", records);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Market price fetch failed");
            error.put("error", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    private void appendParam(StringBuilder url, String key, String value) {
        if (url.charAt(url.length() - 1) != '?') {
            url.append("&");
        }

        url.append(URLEncoder.encode(key, StandardCharsets.UTF_8));
        url.append("=");
        url.append(URLEncoder.encode(value, StandardCharsets.UTF_8));
    }

    private void appendFilter(StringBuilder url, String field, String value) {
        if (url.charAt(url.length() - 1) != '?') {
            url.append("&");
        }

        url.append("filters%5B")
                .append(URLEncoder.encode(field, StandardCharsets.UTF_8))
                .append("%5D=")
                .append(URLEncoder.encode(value, StandardCharsets.UTF_8));
    }

    private String text(JsonNode node, String field) {
        return node.path(field).asText("");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private boolean same(String a, String b) {
        return normalize(a).equals(normalize(b));
    }

    private boolean contains(String a, String b) {
        return normalize(a).contains(normalize(b));
    }

    private boolean commodityMatch(String actual, String selected) {
        String a = normalize(actual);
        String s = normalize(selected);

        return a.equals(s) || a.contains(s) || s.contains(a);
    }

    private double toNumber(String value) {
        try {
            if (isBlank(value)) return 0;
            return Double.parseDouble(value.replace(",", ""));
        } catch (Exception e) {
            return 0;
        }
    }

    private String formatKg(double quintalPrice) {
        if (quintalPrice <= 0) return "0.00";
        return String.format("%.2f", quintalPrice / 100);
    }

    private boolean isVegetable(String commodity) {
        String c = normalize(commodity);

        if (c.isBlank()) return false;

        for (String veg : VEGETABLES) {
            String v = normalize(veg);

            if (c.equals(v) || c.contains(v) || v.contains(c)) {
                return true;
            }
        }

        return false;
    }

    private String normalize(String value) {
        return value == null
                ? ""
                : value.toLowerCase().replaceAll("[^a-z0-9]", "");
    }
}