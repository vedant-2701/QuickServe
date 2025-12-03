package com.quickserve.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private BigDecimal totalEarnings;
    private BigDecimal weeklyEarnings;
    private Integer totalBookings;
    private Integer completedBookings;
    private Integer pendingBookings;
    private Integer todayBookings;
    private BigDecimal averageRating;
    private Integer totalReviews;
    private Integer profileViews;
    private Integer activeServices;
    private String earningsTrend; // e.g., "+12% from last week"
    private String bookingsTrend;
    private String ratingStatus; // e.g., "Top Rated Provider"
    private String viewsTrend;
}
