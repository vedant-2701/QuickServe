package com.quickserve.backend.serviceImpl;

import com.quickserve.backend.dto.response.customer.ReviewResponse;
import com.quickserve.backend.dto.response.publicdto.ProviderDetailResponse;
import com.quickserve.backend.dto.response.publicdto.ProviderListResponse;
import com.quickserve.backend.dto.response.publicdto.ServiceCategoryResponse;
import com.quickserve.backend.exception.ResourceNotFoundException;
import com.quickserve.backend.model.*;
import com.quickserve.backend.model.enums.ServiceCategory;
import com.quickserve.backend.repository.*;
import com.quickserve.backend.service.PublicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PublicServiceImpl implements PublicService {

    private final ServiceProviderRepository serviceProviderRepository;
    private final ProviderServiceRepository providerServiceRepository;
    private final ReviewRepository reviewRepository;
    private final WorkingHoursRepository workingHoursRepository;

    @Override
    public List<ServiceCategoryResponse> getAllCategories() {
        List<ServiceCategoryResponse> categories = new ArrayList<>();
        
        for (ServiceCategory category : ServiceCategory.values()) {
            long count = serviceProviderRepository.countByPrimaryService(category);
            categories.add(ServiceCategoryResponse.builder()
                    .value(category.name())
                    .displayName(category.getDisplayName())
                    .icon(getCategoryIcon(category))
                    .providerCount((int) count)
                    .build());
        }
        
        return categories;
    }

    @Override
    public List<ProviderListResponse> searchProviders(
            String category,
            String city,
            String search,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minRating,
            String sortBy,
            int page,
            int size) {

        // Get all available providers
        List<ServiceProvider> providers = serviceProviderRepository.findByIsAvailableTrue();

        // Filter by category
        if (category != null && !category.isEmpty() && !category.equalsIgnoreCase("All")) {
            try {
                ServiceCategory cat = ServiceCategory.valueOf(category.toUpperCase().replace(" ", "_"));
                providers = providers.stream()
                        .filter(p -> p.getPrimaryService() == cat || 
                                (p.getSecondaryServices() != null && p.getSecondaryServices().contains(cat)))
                        .collect(Collectors.toList());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid category: {}", category);
            }
        }

        // Filter by city
        if (city != null && !city.isEmpty()) {
            providers = providers.stream()
                    .filter(p -> p.getCity().toLowerCase().contains(city.toLowerCase()))
                    .collect(Collectors.toList());
        }

        // Filter by search query
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            providers = providers.stream()
                    .filter(p -> {
                        String name = p.getUser().getFullName().toLowerCase();
                        String primarySvc = p.getPrimaryService().getDisplayName().toLowerCase();
                        List<ProviderService> services = providerServiceRepository.findByProviderAndActiveTrue(p);
                        boolean matchesServiceName = services.stream()
                                .anyMatch(s -> s.getName().toLowerCase().contains(searchLower));
                        return name.contains(searchLower) || 
                               primarySvc.contains(searchLower) || 
                               matchesServiceName;
                    })
                    .collect(Collectors.toList());
        }

        // Filter by price range
        if (minPrice != null || maxPrice != null) {
            providers = providers.stream()
                    .filter(p -> {
                        BigDecimal rate = p.getHourlyRate();
                        if (rate == null) return true;
                        if (minPrice != null && rate.compareTo(minPrice) < 0) return false;
                        if (maxPrice != null && rate.compareTo(maxPrice) > 0) return false;
                        return true;
                    })
                    .collect(Collectors.toList());
        }

        // Filter by minimum rating
        if (minRating != null) {
            providers = providers.stream()
                    .filter(p -> p.getAverageRating() != null && 
                            p.getAverageRating().doubleValue() >= minRating)
                    .collect(Collectors.toList());
        }

        // Sort
        Comparator<ServiceProvider> comparator = switch (sortBy != null ? sortBy.toLowerCase() : "rating") {
            case "reviews" -> Comparator.comparing(ServiceProvider::getTotalReviews, Comparator.nullsLast(Comparator.reverseOrder()));
            case "price-low" -> Comparator.comparing(ServiceProvider::getHourlyRate, Comparator.nullsLast(Comparator.naturalOrder()));
            case "price-high" -> Comparator.comparing(ServiceProvider::getHourlyRate, Comparator.nullsLast(Comparator.reverseOrder()));
            case "experience" -> Comparator.comparing(ServiceProvider::getExperienceYears, Comparator.nullsLast(Comparator.reverseOrder()));
            default -> Comparator.comparing(ServiceProvider::getAverageRating, Comparator.nullsLast(Comparator.reverseOrder()));
        };
        providers.sort(comparator);

        // Paginate
        int start = page * size;
        int end = Math.min(start + size, providers.size());
        if (start >= providers.size()) {
            return Collections.emptyList();
        }

        return providers.subList(start, end).stream()
                .map(this::buildProviderListResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ProviderDetailResponse getProviderDetails(Long providerId) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        // Increment view count
        provider.setProfileViews(provider.getProfileViews() + 1);
        serviceProviderRepository.save(provider);

        return buildProviderDetailResponse(provider);
    }

    @Override
    public List<ReviewResponse> getProviderReviews(Long providerId, int page, int size) {
        ServiceProvider provider = serviceProviderRepository.findById(providerId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found"));

        Pageable pageable = PageRequest.of(page, size);
        Page<Review> reviews = reviewRepository.findByProviderOrderByCreatedAtDesc(provider, pageable);

        return reviews.getContent().stream()
                .map(this::buildReviewResponse)
                .collect(Collectors.toList());
    }

    // ==================== HELPER METHODS ====================

    private ProviderListResponse buildProviderListResponse(ServiceProvider provider) {
        User user = provider.getUser();
        List<ProviderService> services = providerServiceRepository.findByProviderAndActiveTrue(provider);
        
        List<String> serviceNames = services.stream()
                .map(ProviderService::getName)
                .limit(3)
                .collect(Collectors.toList());

        return ProviderListResponse.builder()
                .id(provider.getId())
                .name(user.getFullName())
                .avatarUrl(user.getProfilePhotoUrl())
                .primaryService(provider.getPrimaryService().getDisplayName())
                .services(serviceNames)
                .averageRating(provider.getAverageRating())
                .totalReviews(provider.getTotalReviews())
                .hourlyRate(provider.getHourlyRate())
                .location(provider.getCity() + ", " + provider.getState())
                .verified(provider.isAadharVerified())
                .isAvailable(provider.isAvailable())
                .responseTime("< 1 hr") // TODO: Calculate actual response time
                .completedJobs(provider.getCompletedJobs())
                .experienceYears(provider.getExperienceYears())
                .build();
    }

    private ProviderDetailResponse buildProviderDetailResponse(ServiceProvider provider) {
        User user = provider.getUser();
        List<ProviderService> services = providerServiceRepository.findByProviderAndActiveTrue(provider);
        List<WorkingHours> workingHoursList = workingHoursRepository.findByProvider(provider);
        Page<Review> recentReviews = reviewRepository.findByProviderOrderByCreatedAtDesc(
                provider, PageRequest.of(0, 5));

        // Build services info
        List<ProviderDetailResponse.ServiceInfo> serviceInfos = services.stream()
                .map(s -> ProviderDetailResponse.ServiceInfo.builder()
                        .id(s.getId())
                        .name(s.getName())
                        .description(s.getDescription())
                        .price(s.getPrice())
                        .duration(s.getDuration())
                        .durationMinutes(s.getDurationMinutes())
                        .build())
                .collect(Collectors.toList());

        // Build working hours map
        Map<String, ProviderDetailResponse.WorkingHoursInfo> workingHoursMap = new HashMap<>();
        for (WorkingHours wh : workingHoursList) {
            workingHoursMap.put(wh.getDayOfWeek().name(), 
                    ProviderDetailResponse.WorkingHoursInfo.builder()
                            .startTime(wh.getOpenTime() != null ? wh.getOpenTime().toString() : null)
                            .endTime(wh.getCloseTime() != null ? wh.getCloseTime().toString() : null)
                            .isAvailable(wh.getIsOpen())
                            .build());
        }

        // Build certifications
        List<ProviderDetailResponse.CertificationInfo> certInfos = provider.getCertifications().stream()
                .map(c -> ProviderDetailResponse.CertificationInfo.builder()
                        .name(c.getName())
                        .issuer(c.getIssuer())
                        .year(c.getYear() != null ? c.getYear().toString() : null)
                        .build())
                .collect(Collectors.toList());

        // Build rating distribution
        Map<Integer, Long> ratingDistribution = new HashMap<>();
        for (int i = 1; i <= 5; i++) {
            ratingDistribution.put(i, 0L);
        }
        List<Object[]> distribution = reviewRepository.getRatingDistributionByProvider(provider);
        for (Object[] row : distribution) {
            Integer rating = (Integer) row[0];
            Long count = (Long) row[1];
            ratingDistribution.put(rating, count);
        }

        // Build secondary services
        List<String> secondaryServiceNames = provider.getSecondaryServices() != null ?
                provider.getSecondaryServices().stream()
                        .map(ServiceCategory::getDisplayName)
                        .collect(Collectors.toList()) :
                Collections.emptyList();

        return ProviderDetailResponse.builder()
                .id(provider.getId())
                .name(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getProfilePhotoUrl())
                .bio(provider.getBio())
                .address(provider.getAddress())
                .city(provider.getCity())
                .state(provider.getState())
                .pincode(provider.getPincode())
                .serviceRadiusKm(provider.getServiceRadiusKm())
                .primaryService(provider.getPrimaryService().getDisplayName())
                .secondaryServices(secondaryServiceNames)
                .experienceYears(provider.getExperienceYears())
                .skills(provider.getSkills())
                .languages(provider.getLanguages())
                .certifications(certInfos)
                .averageRating(provider.getAverageRating())
                .totalReviews(provider.getTotalReviews())
                .completedJobs(provider.getCompletedJobs())
                .profileViews(provider.getProfileViews())
                .verified(provider.isAadharVerified())
                .isAvailable(provider.isAvailable())
                .memberSince(user.getCreatedAt())
                .workingHours(workingHoursMap)
                .services(serviceInfos)
                .recentReviews(recentReviews.getContent().stream()
                        .map(this::buildReviewResponse)
                        .collect(Collectors.toList()))
                .ratingDistribution(ratingDistribution)
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

    private String getCategoryIcon(ServiceCategory category) {
        return switch (category) {
            case PLUMBING -> "wrench";
            case ELECTRICAL -> "zap";
            case CLEANING -> "sparkles";
            case CARPENTRY -> "hammer";
            case PAINTING -> "paintbrush";
            case HVAC -> "wind";
            case LANDSCAPING -> "tree-deciduous";
            case PEST_CONTROL -> "bug";
            case APPLIANCE_REPAIR -> "settings";
            case HOME_SECURITY -> "shield";
            case ROOFING -> "home";
            case FLOORING -> "square";
        };
    }
}
