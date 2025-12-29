package com.quickserve.backend.model;

import com.quickserve.backend.model.enums.ServiceCategory;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "service_providers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceProvider {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Identity verification
    @Column(nullable = false)
    private String aadharNumber;

    @Builder.Default
    private boolean aadharVerified = false;

    // Address Information
    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private String pincode;

    // Service Details
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceCategory primaryService;

    @ElementCollection(targetClass = ServiceCategory.class)
    @CollectionTable(name = "provider_secondary_services", joinColumns = @JoinColumn(name = "provider_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "service_category")
    @Builder.Default
    private List<ServiceCategory> secondaryServices = new ArrayList<>();

    @Column(nullable = false)
    private Integer experienceYears;

    @Column(nullable = false)
    private Integer serviceRadiusKm;

    @Column(precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Column(length = 1000)
    private String bio;

    // Languages
    @ElementCollection
    @CollectionTable(name = "provider_languages", joinColumns = @JoinColumn(name = "provider_id"))
    @Column(name = "language")
    @Builder.Default
    private List<String> languages = new ArrayList<>();

    // Skills
    @ElementCollection
    @CollectionTable(name = "provider_skills", joinColumns = @JoinColumn(name = "provider_id"))
    @Column(name = "skill")
    @Builder.Default
    private List<String> skills = new ArrayList<>();

    // Ratings and Stats
    @Column(precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal averageRating = BigDecimal.ZERO;

    @Builder.Default
    private Integer totalReviews = 0;

    @Builder.Default
    private Integer completedJobs = 0;

    @Builder.Default
    private Integer profileViews = 0;

    @Builder.Default
    private boolean isAvailable = true;
    
    @Builder.Default
    private boolean isVerified = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // One-to-Many relationships
    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProviderService> services = new ArrayList<>();

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkingHours> workingHours = new ArrayList<>();

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Certification> certifications = new ArrayList<>();

    // Null-safe getters for fields that may be null in existing database records
    public Integer getTotalReviewsSafe() {
        return totalReviews != null ? totalReviews : 0;
    }

    public Integer getCompletedJobsSafe() {
        return completedJobs != null ? completedJobs : 0;
    }

    public Integer getProfileViewsSafe() {
        return profileViews != null ? profileViews : 0;
    }

    public BigDecimal getAverageRatingSafe() {
        return averageRating != null ? averageRating : BigDecimal.ZERO;
    }

    public Integer getExperienceYearsSafe() {
        return experienceYears != null ? experienceYears : 0;
    }

    public Integer getServiceRadiusKmSafe() {
        return serviceRadiusKm != null ? serviceRadiusKm : 5;
    }

    public BigDecimal getHourlyRateSafe() {
        return hourlyRate != null ? hourlyRate : BigDecimal.ZERO;
    }
}
