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
public class CustomerProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String profilePhotoUrl;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private Integer totalBookings;
    private Integer completedBookings;
    private Integer cancelledBookings;
    private LocalDateTime memberSince;
}
