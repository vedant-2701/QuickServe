package com.quickserve.backend.service;

import com.quickserve.backend.dto.request.CreateServiceRequest;
import com.quickserve.backend.dto.request.UpdateBookingStatusRequest;
import com.quickserve.backend.dto.request.UpdateProfileRequest;
import com.quickserve.backend.dto.request.UpdateServiceRequest;
import com.quickserve.backend.dto.response.BookingResponse;
import com.quickserve.backend.dto.response.DashboardStatsResponse;
import com.quickserve.backend.dto.response.ProviderProfileResponse;
import com.quickserve.backend.dto.response.ProviderServiceResponse;

import java.util.List;

public interface ProviderDashboardService {
    
    // Dashboard stats
    DashboardStatsResponse getDashboardStats(String email);
    
    // Profile
    ProviderProfileResponse getProfile(String email);
    ProviderProfileResponse updateProfile(String email, UpdateProfileRequest request);
    void updateAvailability(String email, boolean available);
    
    // Services
    List<ProviderServiceResponse> getServices(String email);
    ProviderServiceResponse createService(String email, CreateServiceRequest request);
    ProviderServiceResponse updateService(String email, Long serviceId, UpdateServiceRequest request);
    void deleteService(String email, Long serviceId);
    void toggleServiceStatus(String email, Long serviceId);
    
    // Bookings
    List<BookingResponse> getBookings(String email);
    List<BookingResponse> getUpcomingBookings(String email);
    BookingResponse updateBookingStatus(String email, Long bookingId, UpdateBookingStatusRequest request);
}
