package com.quickserve.backend.dto.response.admin;

import com.quickserve.backend.model.enums.AccountStatus;
import com.quickserve.backend.model.enums.ServiceCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderDetailAdminResponse {
    private Long id;
    private Long userId;
    
    // User Info
    private String fullName;
    private String email;
    private String phone;
    private AccountStatus status;
    private String profilePhotoUrl;
    
    // Provider Info
    private String aadharNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private ServiceCategory primaryService;
    private List<ServiceCategory> secondaryServices;
    private Integer experienceYears;
    private Integer serviceRadiusKm;
    private BigDecimal hourlyRate;
    private String bio;
    private List<String> languages;
    private Boolean isAvailable;
    private Boolean isVerified;
    
    // Stats
    private Double avgRating;
    private Integer totalReviews;
    private Integer totalBookings;
    private Integer completedBookings;
    private BigDecimal totalEarnings;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Services offered
    private List<ServiceInfo> services;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ServiceInfo {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer durationMinutes;
        private Boolean isActive;
    }
}
