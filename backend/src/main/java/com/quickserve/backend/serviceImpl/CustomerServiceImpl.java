package com.quickserve.backend.serviceImpl;

import com.quickserve.backend.dto.request.customer.*;
import com.quickserve.backend.dto.response.customer.*;
import com.quickserve.backend.exception.BadRequestException;
import com.quickserve.backend.exception.ResourceNotFoundException;
import com.quickserve.backend.model.*;
import com.quickserve.backend.model.enums.BookingStatus;
import com.quickserve.backend.repository.*;
import com.quickserve.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerServiceImpl implements CustomerService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final BookingRepository bookingRepository;
    private final ProviderServiceRepository providerServiceRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final ReviewRepository reviewRepository;
    private final SavedAddressRepository savedAddressRepository;

    // ==================== PROFILE ====================

    @Override
    public CustomerProfileResponse getProfile(String email) {
        User user = getUserByEmail(email);
        Customer customer = getCustomerByUser(user);

        return buildProfileResponse(user, customer);
    }

    @Override
    @Transactional
    public CustomerProfileResponse updateProfile(String email, UpdateCustomerProfileRequest request) {
        User user = getUserByEmail(email);
        Customer customer = getCustomerByUser(user);

        // Update user fields
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            // Check if phone is already taken by another user
            if (!user.getPhone().equals(request.getPhone()) && 
                userRepository.existsByPhone(request.getPhone())) {
                throw new BadRequestException("Phone number is already in use");
            }
            user.setPhone(request.getPhone());
        }
        if (request.getProfilePhotoUrl() != null) {
            user.setProfilePhotoUrl(request.getProfilePhotoUrl());
        }

        // Update customer fields
        if (request.getAddress() != null) {
            customer.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            customer.setCity(request.getCity());
        }
        if (request.getState() != null) {
            customer.setState(request.getState());
        }
        if (request.getPincode() != null) {
            customer.setPincode(request.getPincode());
        }

        userRepository.save(user);
        customerRepository.save(customer);

        return buildProfileResponse(user, customer);
    }

    // ==================== BOOKINGS ====================

    @Override
    @Transactional
    public CustomerBookingResponse createBooking(String email, CreateBookingRequest request) {
        User user = getUserByEmail(email);
        Customer customer = getCustomerByUser(user);

        // Get provider
        ServiceProvider provider = serviceProviderRepository.findById(request.getProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        if (!provider.isAvailable()) {
            throw new BadRequestException("Provider is not available at the moment");
        }

        // Get service
        ProviderService service = providerServiceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));

        if (!service.getActive()) {
            throw new BadRequestException("This service is not currently available");
        }

        // Verify service belongs to provider
        if (!service.getProvider().getId().equals(provider.getId())) {
            throw new BadRequestException("Service does not belong to this provider");
        }

        // Determine address
        String bookingAddress = request.getAddress();
        if (request.getSavedAddressId() != null) {
            SavedAddress savedAddress = savedAddressRepository.findById(request.getSavedAddressId())
                    .orElseThrow(() -> new ResourceNotFoundException("Saved address not found"));
            bookingAddress = formatAddress(savedAddress);
        }

        // Create booking
        Booking booking = Booking.builder()
                .customer(user)
                .provider(provider)
                .service(service)
                .bookingDate(request.getBookingDate())
                .bookingTime(request.getBookingTime())
                .customerAddress(bookingAddress)
                .price(service.getPrice())
                .notes(request.getNotes())
                .status(BookingStatus.PENDING)
                .build();

        booking = bookingRepository.save(booking);

        // Update customer stats
        customer.setTotalBookings(customer.getTotalBookings() + 1);
        customerRepository.save(customer);

        return buildBookingResponse(booking);
    }

    @Override
    public List<CustomerBookingResponse> getBookings(String email) {
        User user = getUserByEmail(email);
        List<Booking> bookings = bookingRepository.findByCustomerOrderByBookingDateDescBookingTimeDesc(user);
        return bookings.stream()
                .map(this::buildBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerBookingResponse> getUpcomingBookings(String email) {
        User user = getUserByEmail(email);
        List<Booking> bookings = bookingRepository.findByCustomerOrderByBookingDateDescBookingTimeDesc(user);
        
        LocalDate today = LocalDate.now();
        return bookings.stream()
                .filter(b -> !b.getBookingDate().isBefore(today) && 
                        (b.getStatus() == BookingStatus.PENDING || b.getStatus() == BookingStatus.CONFIRMED))
                .map(this::buildBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerBookingResponse> getPastBookings(String email) {
        User user = getUserByEmail(email);
        List<Booking> bookings = bookingRepository.findByCustomerOrderByBookingDateDescBookingTimeDesc(user);
        
        LocalDate today = LocalDate.now();
        return bookings.stream()
                .filter(b -> b.getBookingDate().isBefore(today) || 
                        b.getStatus() == BookingStatus.COMPLETED || 
                        b.getStatus() == BookingStatus.CANCELLED)
                .map(this::buildBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CustomerBookingResponse getBookingById(String email, Long bookingId) {
        User user = getUserByEmail(email);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify booking belongs to customer
        if (!booking.getCustomer().getId().equals(user.getId())) {
            throw new BadRequestException("Booking does not belong to this customer");
        }

        return buildBookingResponse(booking);
    }

    @Override
    @Transactional
    public CustomerBookingResponse cancelBooking(String email, Long bookingId, String reason) {
        User user = getUserByEmail(email);
        Customer customer = getCustomerByUser(user);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify booking belongs to customer
        if (!booking.getCustomer().getId().equals(user.getId())) {
            throw new BadRequestException("Booking does not belong to this customer");
        }

        // Check if booking can be cancelled
        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Cannot cancel a completed booking");
        }
        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancellationReason(reason);
        bookingRepository.save(booking);

        // Update customer stats
        customer.setCancelledBookings(customer.getCancelledBookings() + 1);
        customerRepository.save(customer);

        return buildBookingResponse(booking);
    }

    // ==================== REVIEWS ====================

    @Override
    @Transactional
    public ReviewResponse createReview(String email, CreateReviewRequest request) {
        User user = getUserByEmail(email);

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // Verify booking belongs to customer
        if (!booking.getCustomer().getId().equals(user.getId())) {
            throw new BadRequestException("Booking does not belong to this customer");
        }

        // Check if booking is completed
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new BadRequestException("Can only review completed bookings");
        }

        // Check if review already exists
        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("You have already reviewed this booking");
        }

        Review review = Review.builder()
                .booking(booking)
                .customer(user)
                .provider(booking.getProvider())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);

        // Update provider stats
        ServiceProvider provider = booking.getProvider();
        updateProviderRating(provider);

        return buildReviewResponse(review);
    }

    @Override
    public List<ReviewResponse> getMyReviews(String email) {
        User user = getUserByEmail(email);
        List<Review> reviews = reviewRepository.findByCustomerOrderByCreatedAtDesc(user);
        return reviews.stream()
                .map(this::buildReviewResponse)
                .collect(Collectors.toList());
    }

    // ==================== SAVED ADDRESSES ====================

    @Override
    public List<SavedAddressResponse> getSavedAddresses(String email) {
        User user = getUserByEmail(email);
        Customer customer = getCustomerByUser(user);
        List<SavedAddress> addresses = savedAddressRepository.findByCustomerOrderByIsDefaultDescCreatedAtDesc(customer);
        return addresses.stream()
                .map(this::buildAddressResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SavedAddressResponse addSavedAddress(String email, SavedAddressRequest request) {
        User user = getUserByEmail(email);
        Customer customer = getCustomerByUser(user);

        // If this is set as default, unset other defaults
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetDefaultAddresses(customer);
        }

        // If this is the first address, make it default
        boolean isFirst = savedAddressRepository.countByCustomer(customer) == 0;

        SavedAddress address = SavedAddress.builder()
                .customer(customer)
                .label(request.getLabel())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .isDefault(isFirst || Boolean.TRUE.equals(request.getIsDefault()))
                .build();

        address = savedAddressRepository.save(address);
        return buildAddressResponse(address);
    }

    @Override
    @Transactional
    public SavedAddressResponse updateSavedAddress(String email, Long addressId, SavedAddressRequest request) {
        User user = getUserByEmail(email);
        Customer customer = getCustomerByUser(user);

        SavedAddress address = savedAddressRepository.findByIdAndCustomer(addressId, customer)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (request.getLabel() != null) {
            address.setLabel(request.getLabel());
        }
        if (request.getAddress() != null) {
            address.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            address.setCity(request.getCity());
        }
        if (request.getState() != null) {
            address.setState(request.getState());
        }
        if (request.getPincode() != null) {
            address.setPincode(request.getPincode());
        }
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            unsetDefaultAddresses(customer);
            address.setIsDefault(true);
        }

        address = savedAddressRepository.save(address);
        return buildAddressResponse(address);
    }

    @Override
    @Transactional
    public void deleteSavedAddress(String email, Long addressId) {
        User user = getUserByEmail(email);
        Customer customer = getCustomerByUser(user);

        SavedAddress address = savedAddressRepository.findByIdAndCustomer(addressId, customer)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        boolean wasDefault = address.getIsDefault();
        savedAddressRepository.delete(address);

        // If deleted address was default, set another as default
        if (wasDefault) {
            List<SavedAddress> remaining = savedAddressRepository.findByCustomerOrderByIsDefaultDescCreatedAtDesc(customer);
            if (!remaining.isEmpty()) {
                remaining.get(0).setIsDefault(true);
                savedAddressRepository.save(remaining.get(0));
            }
        }
    }

    @Override
    @Transactional
    public void setDefaultAddress(String email, Long addressId) {
        User user = getUserByEmail(email);
        Customer customer = getCustomerByUser(user);

        SavedAddress address = savedAddressRepository.findByIdAndCustomer(addressId, customer)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        unsetDefaultAddresses(customer);
        address.setIsDefault(true);
        savedAddressRepository.save(address);
    }

    // ==================== HELPER METHODS ====================

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private Customer getCustomerByUser(User user) {
        return customerRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));
    }

    private CustomerProfileResponse buildProfileResponse(User user, Customer customer) {
        return CustomerProfileResponse.builder()
                .id(customer.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .address(customer.getAddress())
                .city(customer.getCity())
                .state(customer.getState())
                .pincode(customer.getPincode())
                .totalBookings(customer.getTotalBookings())
                .completedBookings(customer.getCompletedBookings())
                .cancelledBookings(customer.getCancelledBookings())
                .memberSince(user.getCreatedAt())
                .build();
    }

    private CustomerBookingResponse buildBookingResponse(Booking booking) {
        ServiceProvider provider = booking.getProvider();
        ProviderService service = booking.getService();
        User providerUser = provider.getUser();

        // Check if has review
        Boolean hasReview = reviewRepository.existsByBookingId(booking.getId());
        Integer reviewRating = null;
        if (hasReview) {
            Review review = reviewRepository.findByBookingId(booking.getId()).orElse(null);
            if (review != null) {
                reviewRating = review.getRating();
            }
        }

        return CustomerBookingResponse.builder()
                .id(booking.getId())
                .providerId(provider.getId())
                .providerName(providerUser.getFullName())
                .providerPhone(providerUser.getPhone())
                .providerAvatar(providerUser.getProfilePhotoUrl())
                .providerRating(provider.getAverageRating())
                .providerVerified(provider.isAadharVerified())
                .serviceId(service.getId())
                .serviceName(service.getName())
                .serviceDescription(service.getDescription())
                .serviceDuration(service.getDuration())
                .bookingDate(booking.getBookingDate())
                .bookingTime(booking.getBookingTime())
                .status(booking.getStatus().name())
                .address(booking.getCustomerAddress())
                .price(booking.getPrice())
                .notes(booking.getNotes())
                .createdAt(booking.getCreatedAt())
                .confirmedAt(booking.getConfirmedAt())
                .completedAt(booking.getCompletedAt())
                .cancelledAt(booking.getCancelledAt())
                .cancellationReason(booking.getCancellationReason())
                .hasReview(hasReview)
                .reviewRating(reviewRating)
                .build();
    }

    private ReviewResponse buildReviewResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .bookingId(review.getBooking().getId())
                .serviceName(review.getBooking().getService().getName())
                .providerId(review.getProvider().getId())
                .providerName(review.getProvider().getUser().getFullName())
                .providerAvatar(review.getProvider().getUser().getProfilePhotoUrl())
                .customerName(review.getCustomer().getFullName())
                .customerAvatar(review.getCustomer().getProfilePhotoUrl())
                .rating(review.getRating())
                .comment(review.getComment())
                .providerResponse(review.getProviderResponse())
                .providerRespondedAt(review.getProviderRespondedAt())
                .createdAt(review.getCreatedAt())
                .build();
    }

    private SavedAddressResponse buildAddressResponse(SavedAddress address) {
        return SavedAddressResponse.builder()
                .id(address.getId())
                .label(address.getLabel())
                .address(address.getAddress())
                .city(address.getCity())
                .state(address.getState())
                .pincode(address.getPincode())
                .isDefault(address.getIsDefault())
                .createdAt(address.getCreatedAt())
                .build();
    }

    private String formatAddress(SavedAddress address) {
        return String.format("%s, %s, %s - %s", 
                address.getAddress(), 
                address.getCity(), 
                address.getState(), 
                address.getPincode());
    }

    private void unsetDefaultAddresses(Customer customer) {
        savedAddressRepository.findByCustomerAndIsDefaultTrue(customer)
                .ifPresent(addr -> {
                    addr.setIsDefault(false);
                    savedAddressRepository.save(addr);
                });
    }

    private void updateProviderRating(ServiceProvider provider) {
        Double avgRating = reviewRepository.getAverageRatingByProvider(provider);
        long reviewCount = reviewRepository.countByProvider(provider);
        
        if (avgRating != null) {
            provider.setAverageRating(java.math.BigDecimal.valueOf(avgRating));
        }
        provider.setTotalReviews((int) reviewCount);
        serviceProviderRepository.save(provider);
    }
}
