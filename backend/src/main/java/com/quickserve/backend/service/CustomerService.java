package com.quickserve.backend.service;

import com.quickserve.backend.dto.request.customer.*;
import com.quickserve.backend.dto.response.customer.*;

import java.util.List;

public interface CustomerService {

    // Profile
    CustomerProfileResponse getProfile(String email);
    CustomerProfileResponse updateProfile(String email, UpdateCustomerProfileRequest request);

    // Bookings
    CustomerBookingResponse createBooking(String email, CreateBookingRequest request);
    List<CustomerBookingResponse> getBookings(String email);
    List<CustomerBookingResponse> getUpcomingBookings(String email);
    List<CustomerBookingResponse> getPastBookings(String email);
    CustomerBookingResponse getBookingById(String email, Long bookingId);
    CustomerBookingResponse cancelBooking(String email, Long bookingId, String reason);

    // Reviews
    ReviewResponse createReview(String email, CreateReviewRequest request);
    List<ReviewResponse> getMyReviews(String email);

    // Saved Addresses
    List<SavedAddressResponse> getSavedAddresses(String email);
    SavedAddressResponse addSavedAddress(String email, SavedAddressRequest request);
    SavedAddressResponse updateSavedAddress(String email, Long addressId, SavedAddressRequest request);
    void deleteSavedAddress(String email, Long addressId);
    void setDefaultAddress(String email, Long addressId);
}
