package com.quickserve.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateServiceRequest {
    
    @NotBlank(message = "Service name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    @NotBlank(message = "Duration is required")
    private String duration; // e.g., "1h", "2h", "30min"
    
    @NotNull(message = "Duration in minutes is required")
    @Positive(message = "Duration must be positive")
    private Integer durationMinutes;
    
    private Boolean active = true;
}
