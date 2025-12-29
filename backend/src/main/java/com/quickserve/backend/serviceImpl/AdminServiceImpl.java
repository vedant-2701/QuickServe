package com.quickserve.backend.serviceImpl;

import com.quickserve.backend.dto.request.admin.UpdateUserStatusRequest;
import com.quickserve.backend.dto.request.admin.VerifyProviderRequest;
import com.quickserve.backend.dto.response.admin.*;
import com.quickserve.backend.exception.BadRequestException;
import com.quickserve.backend.exception.ResourceNotFoundException;
import com.quickserve.backend.model.*;
import com.quickserve.backend.model.enums.AccountStatus;
import com.quickserve.backend.model.enums.BookingStatus;
import com.quickserve.backend.model.enums.Role;
import com.quickserve.backend.repository.*;
import com.quickserve.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final BookingRepository bookingRepository;
    private final ProviderServiceRepository providerServiceRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public AdminDashboardStatsResponse getDashboardStats() {
        // Total counts
        long totalUsers = userRepository.count();
        long totalCustomers = userRepository.countByRole(Role.CUSTOMER);
        long totalProviders = userRepository.countByRole(Role.SERVICE_PROVIDER);
        long totalBookings = bookingRepository.count();
        
        // Calculate total revenue from completed bookings
        BigDecimal totalRevenue = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(Booking::getPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Booking status counts
        long pendingBookings = bookingRepository.countByStatus(BookingStatus.PENDING);
        long confirmedBookings = bookingRepository.countByStatus(BookingStatus.CONFIRMED);
        long completedBookings = bookingRepository.countByStatus(BookingStatus.COMPLETED);
        long cancelledBookings = bookingRepository.countByStatus(BookingStatus.CANCELLED);
        
        // Provider status counts
        long activeProviders = userRepository.countByRoleAndStatus(Role.SERVICE_PROVIDER, AccountStatus.ACTIVE);
        long pendingVerificationProviders = userRepository.countByRoleAndStatus(Role.SERVICE_PROVIDER, AccountStatus.PENDING_VERIFICATION);
        long suspendedProviders = userRepository.countByRoleAndStatus(Role.SERVICE_PROVIDER, AccountStatus.SUSPENDED);
        
        // Recent bookings
        List<Booking> recentBookingsList = bookingRepository.findTop10ByOrderByCreatedAtDesc();
        List<AdminDashboardStatsResponse.RecentBookingInfo> recentBookings = recentBookingsList.stream()
                .map(b -> AdminDashboardStatsResponse.RecentBookingInfo.builder()
                        .id(b.getId())
                        .customerName(b.getCustomer().getFullName())
                        .providerName(b.getProvider().getUser().getFullName())
                        .serviceName(b.getService() != null ? b.getService().getName() : "N/A")
                        .status(b.getStatus().name())
                        .amount(b.getPrice())
                        .scheduledDate(b.getBookingDate() != null ? b.getBookingDate().toString() : null)
                        .build())
                .collect(Collectors.toList());
        
        // Recent users
        List<User> recentUsersList = userRepository.findTop10ByOrderByCreatedAtDesc();
        List<AdminDashboardStatsResponse.RecentUserInfo> recentUsers = recentUsersList.stream()
                .map(u -> AdminDashboardStatsResponse.RecentUserInfo.builder()
                        .id(u.getId())
                        .fullName(u.getFullName())
                        .email(u.getEmail())
                        .role(u.getRole().name())
                        .status(u.getStatus().name())
                        .createdAt(u.getCreatedAt() != null ? u.getCreatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE) : null)
                        .build())
                .collect(Collectors.toList());
        
        // Booking by category
        Map<String, Long> bookingsByCategory = new HashMap<>();
        Map<String, BigDecimal> revenueByCategory = new HashMap<>();
        
        List<Booking> allBookings = bookingRepository.findAll();
        for (Booking booking : allBookings) {
            String category = booking.getProvider().getPrimaryService() != null 
                    ? booking.getProvider().getPrimaryService().getDisplayName() 
                    : "Other";
            bookingsByCategory.merge(category, 1L, Long::sum);
            if (booking.getStatus() == BookingStatus.COMPLETED && booking.getPrice() != null) {
                revenueByCategory.merge(category, booking.getPrice(), BigDecimal::add);
            }
        }
        
        return AdminDashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalCustomers(totalCustomers)
                .totalProviders(totalProviders)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .userGrowthPercent(12.5)
                .bookingGrowthPercent(8.3)
                .revenueGrowthPercent(15.2)
                .pendingBookings(pendingBookings)
                .confirmedBookings(confirmedBookings)
                .completedBookings(completedBookings)
                .cancelledBookings(cancelledBookings)
                .activeProviders(activeProviders)
                .pendingVerificationProviders(pendingVerificationProviders)
                .suspendedProviders(suspendedProviders)
                .recentBookings(recentBookings)
                .recentUsers(recentUsers)
                .bookingsByCategory(bookingsByCategory)
                .revenueByCategory(revenueByCategory)
                .build();
    }

    @Override
    public Page<UserListResponse> getAllUsers(String search, Role role, AccountStatus status, Pageable pageable) {
        List<User> users;
        
        if (role != null && status != null) {
            users = userRepository.findByRoleAndStatus(role, status);
        } else if (role != null) {
            users = userRepository.findByRole(role);
        } else if (status != null) {
            users = userRepository.findByStatus(status);
        } else {
            users = userRepository.findAll();
        }
        
        // Apply search filter
        if (search != null && !search.isBlank()) {
            String searchLower = search.toLowerCase();
            users = users.stream()
                    .filter(u -> u.getFullName().toLowerCase().contains(searchLower) ||
                            u.getEmail().toLowerCase().contains(searchLower) ||
                            (u.getPhone() != null && u.getPhone().contains(search)))
                    .collect(Collectors.toList());
        }
        
        List<UserListResponse> responses = users.stream()
                .map(this::mapToUserListResponse)
                .collect(Collectors.toList());
        
        // Apply pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), responses.size());
        
        if (start > responses.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, responses.size());
        }
        
        return new PageImpl<>(responses.subList(start, end), pageable, responses.size());
    }

    @Override
    public UserListResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return mapToUserListResponse(user);
    }

    @Override
    @Transactional
    public UserListResponse updateUserStatus(Long userId, UpdateUserStatusRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot change status of admin users");
        }
        
        user.setStatus(request.getStatus());
        user = userRepository.save(user);
        
        log.info("User status updated: userId={}, newStatus={}", userId, request.getStatus());
        return mapToUserListResponse(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot delete admin users");
        }
        
        // Soft delete by setting status to DEACTIVATED
        user.setStatus(AccountStatus.DEACTIVATED);
        userRepository.save(user);
        
        log.info("User deleted (soft): userId={}", userId);
    }

    @Override
    public Page<ProviderDetailAdminResponse> getAllProviders(String search, AccountStatus status, Boolean verified, Pageable pageable) {
        List<ServiceProvider> providers = serviceProviderRepository.findAll();
        
        // Apply filters
        if (status != null) {
            providers = providers.stream()
                    .filter(p -> p.getUser().getStatus() == status)
                    .collect(Collectors.toList());
        }
        
        if (verified != null) {
            providers = providers.stream()
                    .filter(p -> verified.equals(p.isVerified()))
                    .collect(Collectors.toList());
        }
        
        if (search != null && !search.isBlank()) {
            String searchLower = search.toLowerCase();
            providers = providers.stream()
                    .filter(p -> p.getUser().getFullName().toLowerCase().contains(searchLower) ||
                            p.getUser().getEmail().toLowerCase().contains(searchLower) ||
                            (p.getCity() != null && p.getCity().toLowerCase().contains(searchLower)))
                    .collect(Collectors.toList());
        }
        
        List<ProviderDetailAdminResponse> responses = providers.stream()
                .map(this::mapToProviderDetailResponse)
                .collect(Collectors.toList());
        
        // Apply pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), responses.size());
        
        if (start > responses.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, responses.size());
        }
        
        return new PageImpl<>(responses.subList(start, end), pageable, responses.size());
    }

    @Override
    public ProviderDetailAdminResponse getProviderById(Long providerId) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + providerId));
        return mapToProviderDetailResponse(provider);
    }

    @Override
    @Transactional
    public ProviderDetailAdminResponse verifyProvider(Long providerId, VerifyProviderRequest request) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + providerId));
        
        provider.setVerified(request.getVerified());
        
        // If verified, also activate the account
        if (request.getVerified() && provider.getUser().getStatus() == AccountStatus.PENDING_VERIFICATION) {
            provider.getUser().setStatus(AccountStatus.ACTIVE);
            userRepository.save(provider.getUser());
        }
        
        provider = serviceProviderRepository.save(provider);
        
        log.info("Provider verification updated: providerId={}, verified={}", providerId, request.getVerified());
        return mapToProviderDetailResponse(provider);
    }

    @Override
    @Transactional
    public ProviderDetailAdminResponse updateProviderStatus(Long providerId, UpdateUserStatusRequest request) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + providerId));
        
        provider.getUser().setStatus(request.getStatus());
        userRepository.save(provider.getUser());
        
        log.info("Provider status updated: providerId={}, newStatus={}", providerId, request.getStatus());
        return mapToProviderDetailResponse(provider);
    }

    @Override
    public Page<BookingAdminResponse> getAllBookings(String search, BookingStatus status, Pageable pageable) {
        List<Booking> bookings;
        
        if (status != null) {
            bookings = bookingRepository.findByStatus(status);
        } else {
            bookings = bookingRepository.findAll();
        }
        
        // Apply search filter
        if (search != null && !search.isBlank()) {
            String searchLower = search.toLowerCase();
            bookings = bookings.stream()
                    .filter(b -> b.getCustomer().getFullName().toLowerCase().contains(searchLower) ||
                            b.getProvider().getUser().getFullName().toLowerCase().contains(searchLower) ||
                            (b.getService() != null && b.getService().getName().toLowerCase().contains(searchLower)))
                    .collect(Collectors.toList());
        }
        
        // Sort by created date descending
        bookings.sort((a, b) -> {
            if (a.getCreatedAt() == null) return 1;
            if (b.getCreatedAt() == null) return -1;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        });
        
        List<BookingAdminResponse> responses = bookings.stream()
                .map(this::mapToBookingAdminResponse)
                .collect(Collectors.toList());
        
        // Apply pagination
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), responses.size());
        
        if (start > responses.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, responses.size());
        }
        
        return new PageImpl<>(responses.subList(start, end), pageable, responses.size());
    }

    @Override
    public BookingAdminResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        return mapToBookingAdminResponse(booking);
    }

    @Override
    @Transactional
    public BookingAdminResponse updateBookingStatus(Long bookingId, BookingStatus status, String notes) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
        
        booking.setStatus(status);
        
        if (status == BookingStatus.COMPLETED) {
            booking.setCompletedAt(LocalDateTime.now());
        } else if (status == BookingStatus.CANCELLED) {
            booking.setCancelledAt(LocalDateTime.now());
            if (notes != null) {
                booking.setCancellationReason(notes);
            }
        }
        
        if (notes != null && status != BookingStatus.CANCELLED) {
            booking.setNotes(notes);
        }
        
        booking = bookingRepository.save(booking);
        
        log.info("Booking status updated by admin: bookingId={}, newStatus={}", bookingId, status);
        return mapToBookingAdminResponse(booking);
    }

    @Override
    public Object getRevenueAnalytics(String period) {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("period", period);
        analytics.put("totalRevenue", bookingRepository.findAll().stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(Booking::getPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        return analytics;
    }

    @Override
    public Object getBookingAnalytics(String period) {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("period", period);
        analytics.put("totalBookings", bookingRepository.count());
        analytics.put("completedBookings", bookingRepository.countByStatus(BookingStatus.COMPLETED));
        analytics.put("cancelledBookings", bookingRepository.countByStatus(BookingStatus.CANCELLED));
        return analytics;
    }

    @Override
    public Object getUserAnalytics(String period) {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("period", period);
        analytics.put("totalUsers", userRepository.count());
        analytics.put("totalCustomers", userRepository.countByRole(Role.CUSTOMER));
        analytics.put("totalProviders", userRepository.countByRole(Role.SERVICE_PROVIDER));
        return analytics;
    }

    // Helper methods
    private UserListResponse mapToUserListResponse(User user) {
        UserListResponse.UserListResponseBuilder builder = UserListResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .status(user.getStatus())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt());
        
        if (user.getRole() == Role.SERVICE_PROVIDER) {
            serviceProviderRepository.findByUserId(user.getId()).ifPresent(provider -> {
                builder.providerId(provider.getId())
                        .city(provider.getCity())
                        .state(provider.getState())
                        .totalBookings(bookingRepository.countByProviderId(provider.getId()))
                        .avgRating(provider.getAverageRatingSafe().doubleValue());
            });
        } else if (user.getRole() == Role.CUSTOMER) {
            customerRepository.findByUserId(user.getId()).ifPresent(customer -> {
                builder.customerId(customer.getId())
                        .city(customer.getCity())
                        .state(customer.getState())
                        .totalBookings(customer.getTotalBookings());
            });
        }
        
        return builder.build();
    }

    private ProviderDetailAdminResponse mapToProviderDetailResponse(ServiceProvider provider) {
        User user = provider.getUser();
        
        // Get services
        List<ProviderService> services = providerServiceRepository.findByProviderId(provider.getId());
        List<ProviderDetailAdminResponse.ServiceInfo> serviceInfos = services.stream()
                .map(s -> ProviderDetailAdminResponse.ServiceInfo.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .description(s.getDescription())
                        .price(s.getPrice())
                        .durationMinutes(s.getDurationMinutes())
                        .isActive(s.getActive())
                        .build())
                .collect(Collectors.toList());
        
        // Calculate stats
        int totalBookings = bookingRepository.countByProviderId(provider.getId());
        int completedBookings = bookingRepository.countByProviderIdAndStatus(provider.getId(), BookingStatus.COMPLETED);
        
        BigDecimal totalEarnings = bookingRepository.findByProviderId(provider.getId()).stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .map(Booking::getPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return ProviderDetailAdminResponse.builder()
                .id(provider.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .aadharNumber(provider.getAadharNumber())
                .address(provider.getAddress())
                .city(provider.getCity())
                .state(provider.getState())
                .pincode(provider.getPincode())
                .primaryService(provider.getPrimaryService())
                .secondaryServices(provider.getSecondaryServices())
                .experienceYears(provider.getExperienceYearsSafe())
                .serviceRadiusKm(provider.getServiceRadiusKmSafe())
                .hourlyRate(provider.getHourlyRateSafe())
                .bio(provider.getBio())
                .languages(provider.getLanguages())
                .isAvailable(provider.isAvailable())
                .isVerified(provider.isVerified())
                .avgRating(provider.getAverageRatingSafe().doubleValue())
                .totalReviews(provider.getTotalReviewsSafe())
                .totalBookings(totalBookings)
                .completedBookings(completedBookings)
                .totalEarnings(totalEarnings)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .services(serviceInfos)
                .build();
    }

    private BookingAdminResponse mapToBookingAdminResponse(Booking booking) {
        return BookingAdminResponse.builder()
                .id(booking.getId())
                .customerId(booking.getCustomer().getId())
                .customerName(booking.getCustomer().getFullName())
                .customerEmail(booking.getCustomer().getEmail())
                .customerPhone(booking.getCustomer().getPhone())
                .providerId(booking.getProvider().getId())
                .providerName(booking.getProvider().getUser().getFullName())
                .providerEmail(booking.getProvider().getUser().getEmail())
                .providerPhone(booking.getProvider().getUser().getPhone())
                .serviceId(booking.getService() != null ? booking.getService().getId() : null)
                .serviceName(booking.getService() != null ? booking.getService().getName() : "N/A")
                .serviceCategory(booking.getProvider().getPrimaryService() != null 
                        ? booking.getProvider().getPrimaryService().getDisplayName() : null)
                .scheduledDate(booking.getBookingDate())
                .scheduledTime(booking.getBookingTime())
                .serviceAddress(booking.getCustomerAddress())
                .customerNotes(booking.getNotes())
                .providerNotes(null)
                .status(booking.getStatus())
                .amount(booking.getPrice())
                .paymentStatus(null)
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .completedAt(booking.getCompletedAt())
                .cancelledAt(booking.getCancelledAt())
                .cancellationReason(booking.getCancellationReason())
                .build();
    }
}
