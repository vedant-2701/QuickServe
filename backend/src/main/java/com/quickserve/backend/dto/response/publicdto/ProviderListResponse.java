package com.quickserve.backend.dto.response.publicdto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderListResponse {
    private Long id;
    private String name;
    private String avatarUrl;
    private String primaryService;
    private List<String> services;
    private BigDecimal averageRating;
    private Integer totalReviews;
    private BigDecimal hourlyRate;
    private String location;
    private Boolean verified;
    private Boolean isAvailable;
    private String responseTime;
    private Integer completedJobs;
    private Integer experienceYears;
}
