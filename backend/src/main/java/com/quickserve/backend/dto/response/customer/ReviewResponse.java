package com.quickserve.backend.dto.response.customer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long bookingId;
    private String serviceName;
    
    // Provider info
    private Long providerId;
    private String providerName;
    private String providerAvatar;
    
    // Customer info (for provider's view)
    private String customerName;
    private String customerAvatar;
    
    private Integer rating;
    private String comment;
    private String providerResponse;
    private LocalDateTime providerRespondedAt;
    private LocalDateTime createdAt;
}
