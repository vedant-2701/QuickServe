package com.quickserve.backend.controller;

import com.quickserve.backend.dto.request.admin.UpdateUserStatusRequest;
import com.quickserve.backend.dto.request.admin.VerifyProviderRequest;
import com.quickserve.backend.dto.response.ApiResponse;
import com.quickserve.backend.dto.response.admin.*;
import com.quickserve.backend.model.enums.AccountStatus;
import com.quickserve.backend.model.enums.BookingStatus;
import com.quickserve.backend.model.enums.Role;
import com.quickserve.backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // ==================== Dashboard ====================
    
    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardStatsResponse>> getDashboardStats() {
        AdminDashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved successfully", stats));
    }

    // ==================== User Management ====================
    
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserListResponse>>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) AccountStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<UserListResponse> users = adminService.getAllUsers(search, role, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<UserListResponse>> getUserById(@PathVariable Long userId) {
        UserListResponse user = adminService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User retrieved successfully", user));
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<ApiResponse<UserListResponse>> updateUserStatus(
            @PathVariable Long userId,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        UserListResponse user = adminService.updateUserStatus(userId, request);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", user));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    // ==================== Provider Management ====================
    
    @GetMapping("/providers")
    public ResponseEntity<ApiResponse<Page<ProviderDetailAdminResponse>>> getAllProviders(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) AccountStatus status,
            @RequestParam(required = false) Boolean verified,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<ProviderDetailAdminResponse> providers = adminService.getAllProviders(search, status, verified, pageable);
        return ResponseEntity.ok(ApiResponse.success("Providers retrieved successfully", providers));
    }

    @GetMapping("/providers/{providerId}")
    public ResponseEntity<ApiResponse<ProviderDetailAdminResponse>> getProviderById(@PathVariable Long providerId) {
        ProviderDetailAdminResponse provider = adminService.getProviderById(providerId);
        return ResponseEntity.ok(ApiResponse.success("Provider retrieved successfully", provider));
    }

    @PatchMapping("/providers/{providerId}/verify")
    public ResponseEntity<ApiResponse<ProviderDetailAdminResponse>> verifyProvider(
            @PathVariable Long providerId,
            @Valid @RequestBody VerifyProviderRequest request) {
        ProviderDetailAdminResponse provider = adminService.verifyProvider(providerId, request);
        return ResponseEntity.ok(ApiResponse.success("Provider verification updated successfully", provider));
    }

    @PatchMapping("/providers/{providerId}/status")
    public ResponseEntity<ApiResponse<ProviderDetailAdminResponse>> updateProviderStatus(
            @PathVariable Long providerId,
            @Valid @RequestBody UpdateUserStatusRequest request) {
        ProviderDetailAdminResponse provider = adminService.updateProviderStatus(providerId, request);
        return ResponseEntity.ok(ApiResponse.success("Provider status updated successfully", provider));
    }

    // ==================== Booking Management ====================
    
    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<Page<BookingAdminResponse>>> getAllBookings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BookingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<BookingAdminResponse> bookings = adminService.getAllBookings(search, status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<ApiResponse<BookingAdminResponse>> getBookingById(@PathVariable Long bookingId) {
        BookingAdminResponse booking = adminService.getBookingById(bookingId);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    @PatchMapping("/bookings/{bookingId}/status")
    public ResponseEntity<ApiResponse<BookingAdminResponse>> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> request) {
        BookingStatus status = BookingStatus.valueOf(request.get("status"));
        String notes = request.get("notes");
        BookingAdminResponse booking = adminService.updateBookingStatus(bookingId, status, notes);
        return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully", booking));
    }

    // ==================== Analytics ====================
    
    @GetMapping("/analytics/revenue")
    public ResponseEntity<ApiResponse<Object>> getRevenueAnalytics(
            @RequestParam(defaultValue = "month") String period) {
        Object analytics = adminService.getRevenueAnalytics(period);
        return ResponseEntity.ok(ApiResponse.success("Revenue analytics retrieved successfully", analytics));
    }

    @GetMapping("/analytics/bookings")
    public ResponseEntity<ApiResponse<Object>> getBookingAnalytics(
            @RequestParam(defaultValue = "month") String period) {
        Object analytics = adminService.getBookingAnalytics(period);
        return ResponseEntity.ok(ApiResponse.success("Booking analytics retrieved successfully", analytics));
    }

    @GetMapping("/analytics/users")
    public ResponseEntity<ApiResponse<Object>> getUserAnalytics(
            @RequestParam(defaultValue = "month") String period) {
        Object analytics = adminService.getUserAnalytics(period);
        return ResponseEntity.ok(ApiResponse.success("User analytics retrieved successfully", analytics));
    }
}
