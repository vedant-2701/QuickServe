package com.quickserve.backend.service;

import com.quickserve.backend.dto.response.customer.ReviewResponse;
import com.quickserve.backend.dto.response.publicdto.ProviderDetailResponse;
import com.quickserve.backend.dto.response.publicdto.ProviderListResponse;
import com.quickserve.backend.dto.response.publicdto.ServiceCategoryResponse;

import java.math.BigDecimal;
import java.util.List;

public interface PublicService {

    // Categories
    List<ServiceCategoryResponse> getAllCategories();

    // Providers
    List<ProviderListResponse> searchProviders(
            String category,
            String city,
            String search,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minRating,
            String sortBy,
            int page,
            int size
    );

    ProviderDetailResponse getProviderDetails(Long providerId);

    // Reviews
    List<ReviewResponse> getProviderReviews(Long providerId, int page, int size);
}
