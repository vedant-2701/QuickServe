package com.quickserve.backend.serviceImpl;

import com.quickserve.backend.dto.request.CreateServiceRequest;
import com.quickserve.backend.dto.request.UpdateBookingStatusRequest;
import com.quickserve.backend.dto.request.UpdateProfileRequest;
import com.quickserve.backend.dto.request.UpdateServiceRequest;
import com.quickserve.backend.dto.response.BookingResponse;
import com.quickserve.backend.dto.response.DashboardStatsResponse;
import com.quickserve.backend.dto.response.ProviderProfileResponse;
import com.quickserve.backend.dto.response.ProviderServiceResponse;
import com.quickserve.backend.exception.BadRequestException;
import com.quickserve.backend.exception.ResourceNotFoundException;
import com.quickserve.backend.model.*;
import com.quickserve.backend.model.enums.BookingStatus;
import com.quickserve.backend.model.enums.DayOfWeek;
import com.quickserve.backend.model.enums.ServiceCategory;
import com.quickserve.backend.repository.*;
import com.quickserve.backend.service.ProviderDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProviderDashboardServiceImpl implements ProviderDashboardService {

    private final UserRepository userRepository;
    private final ServiceProviderRepository providerRepository;
    private final ProviderServiceRepository serviceRepository;
    private final BookingRepository bookingRepository;
    private final WorkingHoursRepository workingHoursRepository;

    private ServiceProvider getProviderByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        ServiceProvider provider = providerRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Provider profile not found"));
        
        return provider;
    }

    @Override
    public DashboardStatsResponse getDashboardStats(String email) {
        ServiceProvider provider = getProviderByEmail(email);
        
        LocalDateTime weekAgo = LocalDateTime.now().minusWeeks(1);
        LocalDateTime twoWeeksAgo = LocalDateTime.now().minusWeeks(2);
        LocalDate today = LocalDate.now();
        
        // Calculate earnings
        BigDecimal totalEarnings = bookingRepository.getTotalEarningsByProvider(provider);
        BigDecimal weeklyEarnings = bookingRepository.getEarningsByProviderSince(provider, weekAgo);
        BigDecimal previousWeekEarnings = bookingRepository.getEarningsByProviderSince(provider, twoWeeksAgo)
                .subtract(weeklyEarnings);
        
        // Calculate earnings trend
        String earningsTrend = calculateTrend(weeklyEarnings, previousWeekEarnings);
        
        // Booking counts
        long completedBookings = bookingRepository.countByProviderAndStatus(provider, BookingStatus.COMPLETED);
        long pendingBookings = bookingRepository.countByProviderAndStatus(provider, BookingStatus.PENDING);
        long totalBookings = completedBookings + pendingBookings + 
                bookingRepository.countByProviderAndStatus(provider, BookingStatus.CONFIRMED) +
                bookingRepository.countByProviderAndStatus(provider, BookingStatus.CANCELLED);
        
        // Today's bookings
        List<BookingStatus> activeStatuses = List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED);
        int todayBookings = bookingRepository.findByProviderAndBookingDateAndStatusIn(provider, today, activeStatuses).size();
        
        // Weekly booking comparison
        long thisWeekCompleted = bookingRepository.countCompletedByProviderSince(provider, weekAgo);
        String bookingsTrend = "+" + thisWeekCompleted + " new this week";
        
        // Active services count
        long activeServices = serviceRepository.countByProviderAndActiveTrue(provider);
        
        // Rating status - handle null averageRating
        BigDecimal avgRating = provider.getAverageRating() != null ? provider.getAverageRating() : BigDecimal.ZERO;
        int totalReviews = provider.getTotalReviews() != null ? provider.getTotalReviews() : 0;
        String ratingStatus = avgRating.compareTo(new BigDecimal("4.5")) >= 0 
                ? "Top Rated Provider" : "Good Rating";
        
        return DashboardStatsResponse.builder()
                .totalEarnings(totalEarnings != null ? totalEarnings : BigDecimal.ZERO)
                .weeklyEarnings(weeklyEarnings != null ? weeklyEarnings : BigDecimal.ZERO)
                .totalBookings((int) totalBookings)
                .completedBookings((int) completedBookings)
                .pendingBookings((int) pendingBookings)
                .todayBookings(todayBookings)
                .averageRating(avgRating)
                .totalReviews(totalReviews)
                .profileViews(provider.getProfileViews())
                .activeServices((int) activeServices)
                .earningsTrend(earningsTrend)
                .bookingsTrend(bookingsTrend)
                .ratingStatus(ratingStatus)
                .viewsTrend("+24% this month") // Would need view tracking to calculate properly
                .build();
    }

    private String calculateTrend(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return current.compareTo(BigDecimal.ZERO) > 0 ? "+100%" : "0%";
        }
        BigDecimal diff = current.subtract(previous);
        BigDecimal percentage = diff.divide(previous, 2, java.math.RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
        String sign = percentage.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "";
        return sign + percentage.intValue() + "% from last week";
    }

    @Override
    public ProviderProfileResponse getProfile(String email) {
        ServiceProvider provider = getProviderByEmail(email);
        User user = provider.getUser();
        
        return buildProfileResponse(provider, user);
    }

    private ProviderProfileResponse buildProfileResponse(ServiceProvider provider, User user) {
        // Get working hours
        List<WorkingHours> workingHoursList = workingHoursRepository.findByProviderOrderByDayOfWeek(provider);
        Map<String, ProviderProfileResponse.WorkingHoursDto> workingHoursMap = new HashMap<>();
        
        for (DayOfWeek day : DayOfWeek.values()) {
            workingHoursList.stream()
                    .filter(wh -> wh.getDayOfWeek() == day)
                    .findFirst()
                    .ifPresentOrElse(
                            wh -> workingHoursMap.put(day.name().toLowerCase(), 
                                    ProviderProfileResponse.WorkingHoursDto.builder()
                                            .open(wh.getOpenTime() != null ? wh.getOpenTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "09:00")
                                            .close(wh.getCloseTime() != null ? wh.getCloseTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "18:00")
                                            .isOpen(wh.getIsOpen())
                                            .build()),
                            () -> workingHoursMap.put(day.name().toLowerCase(),
                                    ProviderProfileResponse.WorkingHoursDto.builder()
                                            .open("09:00")
                                            .close("18:00")
                                            .isOpen(false)
                                            .build())
                    );
        }
        
        // Build certifications list
        List<ProviderProfileResponse.CertificationDto> certifications = provider.getCertifications().stream()
                .map(c -> ProviderProfileResponse.CertificationDto.builder()
                        .name(c.getName())
                        .issuer(c.getIssuer())
                        .year(c.getYear())
                        .build())
                .collect(Collectors.toList());
        
        return ProviderProfileResponse.builder()
                .id(provider.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .title(provider.getPrimaryService().getDisplayName())
                .bio(provider.getBio())
                .avatar(user.getProfilePhotoUrl() != null ? user.getProfilePhotoUrl() 
                        : "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.getFullName())
                .location(provider.getCity() + ", " + provider.getState())
                .address(provider.getAddress())
                .city(provider.getCity())
                .state(provider.getState())
                .pincode(provider.getPincode())
                .rating(provider.getAverageRating())
                .reviews(provider.getTotalReviews())
                .experience(provider.getExperienceYears() + "+ Years")
                .completedJobs(provider.getCompletedJobs())
                .responseTime("< 30 mins")
                .verified(provider.isAadharVerified())
                .memberSince(String.valueOf(provider.getCreatedAt().getYear()))
                .primaryService(provider.getPrimaryService().name())
                .secondaryServices(provider.getSecondaryServices().stream()
                        .map(ServiceCategory::name)
                        .collect(Collectors.toList()))
                .serviceRadiusKm(provider.getServiceRadiusKm())
                .hourlyRate(provider.getHourlyRate())
                .languages(provider.getLanguages())
                .skills(provider.getSkills())
                .certifications(certifications)
                .workingHours(workingHoursMap)
                .build();
    }

    @Override
    @Transactional
    public ProviderProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        ServiceProvider provider = getProviderByEmail(email);
        User user = provider.getUser();
        
        // Update user fields
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        
        // Update provider fields
        if (request.getBio() != null) {
            provider.setBio(request.getBio());
        }
        if (request.getAddress() != null) {
            provider.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            provider.setCity(request.getCity());
        }
        if (request.getState() != null) {
            provider.setState(request.getState());
        }
        if (request.getPincode() != null) {
            provider.setPincode(request.getPincode());
        }
        if (request.getExperienceYears() != null) {
            provider.setExperienceYears(request.getExperienceYears());
        }
        if (request.getServiceRadiusKm() != null) {
            provider.setServiceRadiusKm(request.getServiceRadiusKm());
        }
        if (request.getHourlyRate() != null) {
            provider.setHourlyRate(request.getHourlyRate());
        }
        if (request.getPrimaryService() != null) {
            provider.setPrimaryService(ServiceCategory.valueOf(request.getPrimaryService()));
        }
        if (request.getSecondaryServices() != null) {
            provider.setSecondaryServices(request.getSecondaryServices().stream()
                    .map(ServiceCategory::valueOf)
                    .collect(Collectors.toList()));
        }
        if (request.getLanguages() != null) {
            provider.setLanguages(request.getLanguages());
        }
        if (request.getSkills() != null) {
            provider.setSkills(request.getSkills());
        }
        
        // Update certifications
        if (request.getCertifications() != null) {
            provider.getCertifications().clear();
            for (UpdateProfileRequest.CertificationDto certDto : request.getCertifications()) {
                Certification cert = Certification.builder()
                        .provider(provider)
                        .name(certDto.getName())
                        .issuer(certDto.getIssuer())
                        .year(certDto.getYear())
                        .build();
                provider.getCertifications().add(cert);
            }
        }
        
        // Update working hours
        if (request.getWorkingHours() != null) {
            for (Map.Entry<String, UpdateProfileRequest.WorkingHoursDto> entry : request.getWorkingHours().entrySet()) {
                DayOfWeek day = DayOfWeek.valueOf(entry.getKey().toUpperCase());
                UpdateProfileRequest.WorkingHoursDto hoursDto = entry.getValue();
                
                WorkingHours workingHours = workingHoursRepository.findByProviderAndDayOfWeek(provider, day)
                        .orElse(WorkingHours.builder().provider(provider).dayOfWeek(day).build());
                
                workingHours.setOpenTime(LocalTime.parse(hoursDto.getOpen()));
                workingHours.setCloseTime(LocalTime.parse(hoursDto.getClose()));
                workingHours.setIsOpen(hoursDto.getIsOpen());
                
                workingHoursRepository.save(workingHours);
            }
        }
        
        userRepository.save(user);
        providerRepository.save(provider);
        
        return buildProfileResponse(provider, user);
    }

    @Override
    @Transactional
    public void updateAvailability(String email, boolean available) {
        ServiceProvider provider = getProviderByEmail(email);
        provider.setAvailable(available);
        providerRepository.save(provider);
    }

    @Override
    public List<ProviderServiceResponse> getServices(String email) {
        ServiceProvider provider = getProviderByEmail(email);
        return serviceRepository.findByProviderOrderByCreatedAtDesc(provider).stream()
                .map(this::mapToServiceResponse)
                .collect(Collectors.toList());
    }

    private ProviderServiceResponse mapToServiceResponse(ProviderService service) {
        return ProviderServiceResponse.builder()
                .id(service.getId())
                .name(service.getName())
                .description(service.getDescription())
                .price(service.getPrice())
                .duration(service.getDuration())
                .durationMinutes(service.getDurationMinutes())
                .active(service.getActive())
                .createdAt(service.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public ProviderServiceResponse createService(String email, CreateServiceRequest request) {
        ServiceProvider provider = getProviderByEmail(email);
        
        ProviderService service = ProviderService.builder()
                .provider(provider)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .duration(request.getDuration())
                .durationMinutes(request.getDurationMinutes())
                .active(request.getActive() != null ? request.getActive() : true)
                .build();
        
        service = serviceRepository.save(service);
        return mapToServiceResponse(service);
    }

    @Override
    @Transactional
    public ProviderServiceResponse updateService(String email, Long serviceId, UpdateServiceRequest request) {
        ServiceProvider provider = getProviderByEmail(email);
        
        ProviderService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        
        if (!service.getProvider().getId().equals(provider.getId())) {
            throw new BadRequestException("You can only update your own services");
        }
        
        if (request.getName() != null) {
            service.setName(request.getName());
        }
        if (request.getDescription() != null) {
            service.setDescription(request.getDescription());
        }
        if (request.getPrice() != null) {
            service.setPrice(request.getPrice());
        }
        if (request.getDuration() != null) {
            service.setDuration(request.getDuration());
        }
        if (request.getDurationMinutes() != null) {
            service.setDurationMinutes(request.getDurationMinutes());
        }
        if (request.getActive() != null) {
            service.setActive(request.getActive());
        }
        
        service = serviceRepository.save(service);
        return mapToServiceResponse(service);
    }

    @Override
    @Transactional
    public void deleteService(String email, Long serviceId) {
        ServiceProvider provider = getProviderByEmail(email);
        
        ProviderService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        
        if (!service.getProvider().getId().equals(provider.getId())) {
            throw new BadRequestException("You can only delete your own services");
        }
        
        serviceRepository.delete(service);
    }

    @Override
    @Transactional
    public void toggleServiceStatus(String email, Long serviceId) {
        ServiceProvider provider = getProviderByEmail(email);
        
        ProviderService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        
        if (!service.getProvider().getId().equals(provider.getId())) {
            throw new BadRequestException("You can only modify your own services");
        }
        
        service.setActive(!service.getActive());
        serviceRepository.save(service);
    }

    @Override
    public List<BookingResponse> getBookings(String email) {
        ServiceProvider provider = getProviderByEmail(email);
        return bookingRepository.findByProviderOrderByBookingDateDescBookingTimeDesc(provider).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getUpcomingBookings(String email) {
        ServiceProvider provider = getProviderByEmail(email);
        return bookingRepository.findUpcomingByProvider(provider, LocalDate.now()).stream()
                .map(this::mapToBookingResponse)
                .collect(Collectors.toList());
    }

    private BookingResponse mapToBookingResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .customer(booking.getCustomer().getFullName())
                .customerPhone(booking.getCustomer().getPhone())
                .service(booking.getService().getName())
                .serviceId(booking.getService().getId())
                .date(booking.getBookingDate())
                .time(booking.getBookingTime())
                .status(booking.getStatus().name().toLowerCase())
                .address(booking.getCustomerAddress())
                .price(booking.getPrice())
                .notes(booking.getNotes())
                .createdAt(booking.getCreatedAt())
                .confirmedAt(booking.getConfirmedAt())
                .completedAt(booking.getCompletedAt())
                .build();
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(String email, Long bookingId, UpdateBookingStatusRequest request) {
        ServiceProvider provider = getProviderByEmail(email);
        
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        
        if (!booking.getProvider().getId().equals(provider.getId())) {
            throw new BadRequestException("You can only update your own bookings");
        }
        
        BookingStatus newStatus = BookingStatus.valueOf(request.getStatus().toUpperCase());
        BookingStatus currentStatus = booking.getStatus();
        
        // Validate status transition
        validateStatusTransition(currentStatus, newStatus);
        
        booking.setStatus(newStatus);
        
        switch (newStatus) {
            case CONFIRMED:
                booking.setConfirmedAt(LocalDateTime.now());
                break;
            case COMPLETED:
                booking.setCompletedAt(LocalDateTime.now());
                // Update provider stats
                provider.setCompletedJobs(provider.getCompletedJobs() + 1);
                providerRepository.save(provider);
                break;
            case CANCELLED:
                booking.setCancelledAt(LocalDateTime.now());
                booking.setCancellationReason(request.getCancellationReason());
                break;
        }
        
        booking = bookingRepository.save(booking);
        return mapToBookingResponse(booking);
    }

    private void validateStatusTransition(BookingStatus from, BookingStatus to) {
        boolean valid = switch (from) {
            case PENDING -> to == BookingStatus.CONFIRMED || to == BookingStatus.CANCELLED;
            case CONFIRMED -> to == BookingStatus.COMPLETED || to == BookingStatus.CANCELLED || to == BookingStatus.IN_PROGRESS;
            case IN_PROGRESS -> to == BookingStatus.COMPLETED || to == BookingStatus.CANCELLED;
            default -> false;
        };
        
        if (!valid) {
            throw new BadRequestException("Invalid status transition from " + from + " to " + to);
        }
    }
}
