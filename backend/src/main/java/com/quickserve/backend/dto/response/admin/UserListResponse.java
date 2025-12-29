package com.quickserve.backend.dto.response.admin;

import com.quickserve.backend.model.enums.AccountStatus;
import com.quickserve.backend.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserListResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private Role role;
    private AccountStatus status;
    private String profilePhotoUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Role-specific info
    private Long providerId;
    private Long customerId;
    private String city;
    private String state;
    
    // Stats
    private Integer totalBookings;
    private Double avgRating;
}
