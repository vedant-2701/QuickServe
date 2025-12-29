package com.quickserve.backend.dto.response.admin;

import com.quickserve.backend.model.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingAdminResponse {
    private Long id;
    
    // Customer Info
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    
    // Provider Info
    private Long providerId;
    private String providerName;
    private String providerEmail;
    private String providerPhone;
    
    // Service Info
    private Long serviceId;
    private String serviceName;
    private String serviceCategory;
    
    // Booking Details
    private LocalDate scheduledDate;
    private LocalTime scheduledTime;
    private String serviceAddress;
    private String customerNotes;
    private String providerNotes;
    
    // Status and Payment
    private BookingStatus status;
    private BigDecimal amount;
    private String paymentStatus;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;
    private String cancellationReason;
}
