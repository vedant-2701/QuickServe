package com.quickserve.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String fullName;
    private String phone;
    private String bio;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private Integer experienceYears;
    private Integer serviceRadiusKm;
    private BigDecimal hourlyRate;
    private String primaryService;
    private List<String> secondaryServices;
    private List<String> languages;
    private List<String> skills;
    private List<CertificationDto> certifications;
    private Map<String, WorkingHoursDto> workingHours;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificationDto {
        private String name;
        private String issuer;
        private String year;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkingHoursDto {
        private String open;
        private String close;
        private Boolean isOpen;
    }
}
