package com.quickserve.backend.dto.request.admin;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerifyProviderRequest {
    
    @NotNull(message = "Verification status is required")
    private Boolean verified;
    
    private String notes;
}
