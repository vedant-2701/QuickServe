package com.quickserve.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String title; // primaryService display name
    private String bio;
    private String avatar;
    private String location; // city, state
    private String address;
    private String city;
    private String state;
    private String pincode;
    
    // Stats
    private BigDecimal rating;
    private Integer reviews;
    private String experience;
    private Integer completedJobs;
    private String responseTime;
    private Boolean verified;
    private String memberSince;
    
    // Service info
    private String primaryService;
    private List<String> secondaryServices;
    private Integer serviceRadiusKm;
    private BigDecimal hourlyRate;
    
    // Additional info
    private List<String> languages;
    private List<String> skills;
    private List<CertificationDto> certifications;
    private Map<String, WorkingHoursDto> workingHours;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificationDto {
        private String name;
        private String issuer;
        private String year;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkingHoursDto {
        private String open;
        private String close;
        private Boolean isOpen;
    }
}
