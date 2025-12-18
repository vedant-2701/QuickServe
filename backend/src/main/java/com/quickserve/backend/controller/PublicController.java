package com.quickserve.backend.controller;

import com.quickserve.backend.dto.response.ApiResponse;
import com.quickserve.backend.dto.response.customer.ReviewResponse;
import com.quickserve.backend.dto.response.publicdto.ProviderDetailResponse;
import com.quickserve.backend.dto.response.publicdto.ProviderListResponse;
import com.quickserve.backend.dto.response.publicdto.ServiceCategoryResponse;
import com.quickserve.backend.service.PublicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final PublicService publicService;

    // ==================== CATEGORIES ====================

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<ServiceCategoryResponse>>> getCategories() {
        List<ServiceCategoryResponse> categories = publicService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }

    // ==================== PROVIDERS ====================

    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<List<ProviderListResponse>>> searchProviders(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(defaultValue = "rating") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        List<ProviderListResponse> providers = publicService.searchProviders(
                category, city, search, minPrice, maxPrice, minRating, sortBy, page, size);
        return ResponseEntity.ok(ApiResponse.success("Providers retrieved successfully", providers));
    }

    @GetMapping("/providers/{providerId}")
    public ResponseEntity<ApiResponse<ProviderDetailResponse>> getProviderDetails(
            @PathVariable Long providerId) {
        ProviderDetailResponse provider = publicService.getProviderDetails(providerId);
        return ResponseEntity.ok(ApiResponse.success("Provider details retrieved successfully", provider));
    }

    @GetMapping("/providers/{providerId}/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getProviderReviews(
            @PathVariable Long providerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<ReviewResponse> reviews = publicService.getProviderReviews(providerId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", reviews));
    }
}
