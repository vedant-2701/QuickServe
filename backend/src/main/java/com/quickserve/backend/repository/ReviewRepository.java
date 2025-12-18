package com.quickserve.backend.repository;

import com.quickserve.backend.model.Review;
import com.quickserve.backend.model.ServiceProvider;
import com.quickserve.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Provider reviews
    List<Review> findByProviderOrderByCreatedAtDesc(ServiceProvider provider);

    Page<Review> findByProviderOrderByCreatedAtDesc(ServiceProvider provider, Pageable pageable);

    // Customer reviews
    List<Review> findByCustomerOrderByCreatedAtDesc(User customer);

    // Check if booking already has a review
    Optional<Review> findByBookingId(Long bookingId);

    boolean existsByBookingId(Long bookingId);

    // Stats
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.provider = :provider")
    Double getAverageRatingByProvider(@Param("provider") ServiceProvider provider);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.provider = :provider")
    long countByProvider(@Param("provider") ServiceProvider provider);

    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.provider = :provider GROUP BY r.rating ORDER BY r.rating DESC")
    List<Object[]> getRatingDistributionByProvider(@Param("provider") ServiceProvider provider);
}
