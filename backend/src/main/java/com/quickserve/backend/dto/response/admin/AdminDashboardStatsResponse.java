package com.quickserve.backend.dto.response.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatsResponse {
    
    // Overview Stats
    private Long totalUsers;
    private Long totalCustomers;
    private Long totalProviders;
    private Long totalBookings;
    private BigDecimal totalRevenue;
    
    // Growth Stats (compared to last month)
    private Double userGrowthPercent;
    private Double bookingGrowthPercent;
    private Double revenueGrowthPercent;
    
    // Booking Stats
    private Long pendingBookings;
    private Long confirmedBookings;
    private Long completedBookings;
    private Long cancelledBookings;
    
    // Provider Stats
    private Long activeProviders;
    private Long pendingVerificationProviders;
    private Long suspendedProviders;
    
    // Recent Activity
    private List<RecentBookingInfo> recentBookings;
    private List<RecentUserInfo> recentUsers;
    
    // Category Distribution
    private Map<String, Long> bookingsByCategory;
    private Map<String, BigDecimal> revenueByCategory;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentBookingInfo {
        private Long id;
        private String customerName;
        private String providerName;
        private String serviceName;
        private String status;
        private BigDecimal amount;
        private String scheduledDate;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecentUserInfo {
        private Long id;
        private String fullName;
        private String email;
        private String role;
        private String status;
        private String createdAt;
    }
}
