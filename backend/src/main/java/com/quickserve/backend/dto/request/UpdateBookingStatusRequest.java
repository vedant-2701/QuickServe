package com.quickserve.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateBookingStatusRequest {
    
    @NotBlank(message = "Status is required")
    private String status; // CONFIRMED, COMPLETED, CANCELLED
    
    private String cancellationReason;
}
