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
    private List<String> languages = new ArrayList<>();

    // Ratings and Stats
    @Column(precision = 3, scale = 2)
    private BigDecimal averageRating = BigDecimal.ZERO;

    private Integer totalReviews = 0;

    private Integer completedJobs = 0;

    private boolean isAvailable = true;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
