package com.quickserve.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateServiceRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private String duration;
    private Integer durationMinutes;
    private Boolean active;
}
