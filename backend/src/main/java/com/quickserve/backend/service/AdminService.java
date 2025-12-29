package com.quickserve.backend.service;

import com.quickserve.backend.dto.request.admin.UpdateUserStatusRequest;
import com.quickserve.backend.dto.request.admin.VerifyProviderRequest;
import com.quickserve.backend.dto.response.admin.*;
import com.quickserve.backend.model.enums.AccountStatus;
import com.quickserve.backend.model.enums.BookingStatus;
import com.quickserve.backend.model.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    
    // Dashboard
    AdminDashboardStatsResponse getDashboardStats();
    
    // User Management
    Page<UserListResponse> getAllUsers(String search, Role role, AccountStatus status, Pageable pageable);
    UserListResponse getUserById(Long userId);
    UserListResponse updateUserStatus(Long userId, UpdateUserStatusRequest request);
    void deleteUser(Long userId);
    
    // Provider Management
    Page<ProviderDetailAdminResponse> getAllProviders(String search, AccountStatus status, Boolean verified, Pageable pageable);
    ProviderDetailAdminResponse getProviderById(Long providerId);
    ProviderDetailAdminResponse verifyProvider(Long providerId, VerifyProviderRequest request);
    ProviderDetailAdminResponse updateProviderStatus(Long providerId, UpdateUserStatusRequest request);
    
    // Booking Management
    Page<BookingAdminResponse> getAllBookings(String search, BookingStatus status, Pageable pageable);
    BookingAdminResponse getBookingById(Long bookingId);
    BookingAdminResponse updateBookingStatus(Long bookingId, BookingStatus status, String notes);
    
    // Analytics
    Object getRevenueAnalytics(String period);
    Object getBookingAnalytics(String period);
    Object getUserAnalytics(String period);
}
