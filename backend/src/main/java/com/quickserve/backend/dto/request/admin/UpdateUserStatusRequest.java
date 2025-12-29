package com.quickserve.backend.dto.request.admin;

import com.quickserve.backend.model.enums.AccountStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserStatusRequest {
    
    @NotNull(message = "Status is required")
    private AccountStatus status;
    
    private String reason;
}
