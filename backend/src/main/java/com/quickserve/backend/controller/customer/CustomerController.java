package com.quickserve.backend.controller.customer;

import com.quickserve.backend.dto.request.customer.*;
import com.quickserve.backend.dto.response.ApiResponse;
import com.quickserve.backend.dto.response.customer.*;
import com.quickserve.backend.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    // ==================== PROFILE ====================

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<CustomerProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        CustomerProfileResponse profile = customerService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<CustomerProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateCustomerProfileRequest request) {
        CustomerProfileResponse profile = customerService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    // ==================== BOOKINGS ====================

    @PostMapping("/bookings")
    public ResponseEntity<ApiResponse<CustomerBookingResponse>> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateBookingRequest request) {
        CustomerBookingResponse booking = customerService.createBooking(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully", booking));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<CustomerBookingResponse>>> getBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<CustomerBookingResponse> bookings = customerService.getBookings(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/bookings/upcoming")
    public ResponseEntity<ApiResponse<List<CustomerBookingResponse>>> getUpcomingBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<CustomerBookingResponse> bookings = customerService.getUpcomingBookings(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Upcoming bookings retrieved successfully", bookings));
    }

    @GetMapping("/bookings/past")
    public ResponseEntity<ApiResponse<List<CustomerBookingResponse>>> getPastBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<CustomerBookingResponse> bookings = customerService.getPastBookings(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Past bookings retrieved successfully", bookings));
    }

    @GetMapping("/bookings/{bookingId}")
    public ResponseEntity<ApiResponse<CustomerBookingResponse>> getBookingById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId) {
        CustomerBookingResponse booking = customerService.getBookingById(userDetails.getUsername(), bookingId);
        return ResponseEntity.ok(ApiResponse.success("Booking retrieved successfully", booking));
    }

    @PostMapping("/bookings/{bookingId}/cancel")
    public ResponseEntity<ApiResponse<CustomerBookingResponse>> cancelBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> request) {
        String reason = request.getOrDefault("reason", "Cancelled by customer");
        CustomerBookingResponse booking = customerService.cancelBooking(userDetails.getUsername(), bookingId, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }

    // ==================== REVIEWS ====================

    @PostMapping("/reviews")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateReviewRequest request) {
        ReviewResponse review = customerService.createReview(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Review created successfully", review));
    }

    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ReviewResponse> reviews = customerService.getMyReviews(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved successfully", reviews));
    }

    // ==================== SAVED ADDRESSES ====================

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<SavedAddressResponse>>> getSavedAddresses(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<SavedAddressResponse> addresses = customerService.getSavedAddresses(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Addresses retrieved successfully", addresses));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<SavedAddressResponse>> addSavedAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody SavedAddressRequest request) {
        SavedAddressResponse address = customerService.addSavedAddress(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Address saved successfully", address));
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<SavedAddressResponse>> updateSavedAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long addressId,
            @Valid @RequestBody SavedAddressRequest request) {
        SavedAddressResponse address = customerService.updateSavedAddress(
                userDetails.getUsername(), addressId, request);
        return ResponseEntity.ok(ApiResponse.success("Address updated successfully", address));
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<ApiResponse<Void>> deleteSavedAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long addressId) {
        customerService.deleteSavedAddress(userDetails.getUsername(), addressId);
        return ResponseEntity.ok(ApiResponse.success("Address deleted successfully", null));
    }

    @PatchMapping("/addresses/{addressId}/default")
    public ResponseEntity<ApiResponse<Void>> setDefaultAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long addressId) {
        customerService.setDefaultAddress(userDetails.getUsername(), addressId);
        return ResponseEntity.ok(ApiResponse.success("Default address updated successfully", null));
    }
}
