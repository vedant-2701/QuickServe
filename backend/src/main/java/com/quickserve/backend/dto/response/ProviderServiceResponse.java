package com.quickserve.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProviderServiceResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String duration;
    private Integer durationMinutes;
    private Boolean active;
    private LocalDateTime createdAt;
}
