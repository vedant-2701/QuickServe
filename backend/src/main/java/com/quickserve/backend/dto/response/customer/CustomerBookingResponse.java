package com.quickserve.backend.dto.response.customer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerBookingResponse {
    private Long id;
    
    // Provider details
    private Long providerId;
    private String providerName;
    private String providerPhone;
    private String providerAvatar;
    private BigDecimal providerRating;
    private Boolean providerVerified;
    
    // Service details
    private Long serviceId;
    private String serviceName;
    private String serviceDescription;
    private String serviceDuration;
    
    // Booking details
    private LocalDate bookingDate;
    private LocalTime bookingTime;
    private String status;
    private String address;
    private BigDecimal price;
    private String notes;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;
    private String cancellationReason;
    
    // Review status
    private Boolean hasReview;
    private Integer reviewRating;
}
