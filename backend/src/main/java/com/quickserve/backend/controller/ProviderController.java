package com.quickserve.backend.controller;

import com.quickserve.backend.dto.request.CreateServiceRequest;
import com.quickserve.backend.dto.request.UpdateBookingStatusRequest;
import com.quickserve.backend.dto.request.UpdateProfileRequest;
import com.quickserve.backend.dto.request.UpdateServiceRequest;
import com.quickserve.backend.dto.response.ApiResponse;
import com.quickserve.backend.dto.response.BookingResponse;
import com.quickserve.backend.dto.response.DashboardStatsResponse;
import com.quickserve.backend.dto.response.ProviderProfileResponse;
import com.quickserve.backend.dto.response.ProviderServiceResponse;
import com.quickserve.backend.service.ProviderDashboardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/provider")
@RequiredArgsConstructor
public class ProviderController {

    private final ProviderDashboardService dashboardService;

    // ==================== DASHBOARD STATS ====================

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats(
            @AuthenticationPrincipal UserDetails userDetails) {
        DashboardStatsResponse stats = dashboardService.getDashboardStats(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully", stats));
    }

    // ==================== PROFILE ====================

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        ProviderProfileResponse profile = dashboardService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<ProviderProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {
        ProviderProfileResponse profile = dashboardService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    @PatchMapping("/availability")
    public ResponseEntity<ApiResponse<String>> updateAvailability(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Boolean> request) {
        Boolean available = request.get("available");
        if (available == null) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("'available' field is required"));
        }
        dashboardService.updateAvailability(userDetails.getUsername(), available);
        return ResponseEntity.ok(ApiResponse.success("Availability updated successfully", null));
    }

    // ==================== SERVICES ====================

    @GetMapping("/services")
    public ResponseEntity<ApiResponse<List<ProviderServiceResponse>>> getServices(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ProviderServiceResponse> services = dashboardService.getServices(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Services retrieved successfully", services));
    }

    @PostMapping("/services")
    public ResponseEntity<ApiResponse<ProviderServiceResponse>> createService(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateServiceRequest request) {
        ProviderServiceResponse service = dashboardService.createService(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Service created successfully", service));
    }

    @PutMapping("/services/{serviceId}")
    public ResponseEntity<ApiResponse<ProviderServiceResponse>> updateService(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long serviceId,
            @RequestBody UpdateServiceRequest request) {
        ProviderServiceResponse service = dashboardService.updateService(
                userDetails.getUsername(), serviceId, request);
        return ResponseEntity.ok(ApiResponse.success("Service updated successfully", service));
    }

    @DeleteMapping("/services/{serviceId}")
    public ResponseEntity<ApiResponse<String>> deleteService(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long serviceId) {
        dashboardService.deleteService(userDetails.getUsername(), serviceId);
        return ResponseEntity.ok(ApiResponse.success("Service deleted successfully", null));
    }

    @PatchMapping("/services/{serviceId}/toggle")
    public ResponseEntity<ApiResponse<String>> toggleServiceStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long serviceId) {
        dashboardService.toggleServiceStatus(userDetails.getUsername(), serviceId);
        return ResponseEntity.ok(ApiResponse.success("Service status toggled successfully", null));
    }

    // ==================== BOOKINGS ====================

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<BookingResponse> bookings = dashboardService.getBookings(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/bookings/upcoming")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getUpcomingBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<BookingResponse> bookings = dashboardService.getUpcomingBookings(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Upcoming bookings retrieved successfully", bookings));
    }

    @PatchMapping("/bookings/{bookingId}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateBookingStatus(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId,
            @Valid @RequestBody UpdateBookingStatusRequest request) {
        BookingResponse booking = dashboardService.updateBookingStatus(
                userDetails.getUsername(), bookingId, request);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully", booking));
    }
}
