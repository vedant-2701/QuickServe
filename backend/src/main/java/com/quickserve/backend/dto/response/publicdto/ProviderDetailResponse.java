package com.quickserve.backend.dto.response.publicdto;

import com.quickserve.backend.dto.response.customer.ReviewResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderDetailResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String avatarUrl;
    private String bio;
    
    // Location
    private String address;
    private String city;
    private String state;
    private String pincode;
    private Integer serviceRadiusKm;
    
    // Service details
    private String primaryService;
    private List<String> secondaryServices;
    private Integer experienceYears;
    
    // Skills and languages
    private List<String> skills;
    private List<String> languages;
    private List<CertificationInfo> certifications;
    
    // Stats
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer completedJobs;
    private Integer profileViews;
    
    // Status
    private Boolean verified;
    private Boolean isAvailable;
    private LocalDateTime memberSince;
    
    // Working hours
    private Map<String, WorkingHoursInfo> workingHours;
    
    // Services offered
    private List<ServiceInfo> services;
    
    // Recent reviews
    private List<ReviewResponse> recentReviews;
    
    // Rating distribution
    private Map<Integer, Long> ratingDistribution;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificationInfo {
        private String name;
        private String issuer;
        private String year;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkingHoursInfo {
        private String startTime;
        private String endTime;
        private Boolean isAvailable;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceInfo {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private String duration;
        private Integer durationMinutes;
    }
}
