package com.quickserve.backend.repository;

import com.quickserve.backend.model.Booking;
import com.quickserve.backend.model.ServiceProvider;
import com.quickserve.backend.model.User;
import com.quickserve.backend.model.enums.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Provider bookings
    List<Booking> findByProviderOrderByBookingDateDescBookingTimeDesc(ServiceProvider provider);
    
    Page<Booking> findByProviderOrderByBookingDateDescBookingTimeDesc(ServiceProvider provider, Pageable pageable);
    
    List<Booking> findByProviderAndStatus(ServiceProvider provider, BookingStatus status);
    
    List<Booking> findByProviderAndBookingDate(ServiceProvider provider, LocalDate date);
    
    List<Booking> findByProviderAndBookingDateAndStatusIn(ServiceProvider provider, LocalDate date, List<BookingStatus> statuses);
    
    // Customer bookings
    List<Booking> findByCustomerOrderByBookingDateDescBookingTimeDesc(User customer);
    
    // Stats queries
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.provider = :provider AND b.status = :status")
    long countByProviderAndStatus(@Param("provider") ServiceProvider provider, @Param("status") BookingStatus status);
    
    @Query("SELECT COALESCE(SUM(b.price), 0) FROM Booking b WHERE b.provider = :provider AND b.status = 'COMPLETED'")
    BigDecimal getTotalEarningsByProvider(@Param("provider") ServiceProvider provider);
    
    @Query("SELECT COALESCE(SUM(b.price), 0) FROM Booking b WHERE b.provider = :provider AND b.status = 'COMPLETED' AND b.completedAt >= :startDate")
    BigDecimal getEarningsByProviderSince(@Param("provider") ServiceProvider provider, @Param("startDate") java.time.LocalDateTime startDate);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.provider = :provider AND b.status = 'COMPLETED' AND b.completedAt >= :startDate")
    long countCompletedByProviderSince(@Param("provider") ServiceProvider provider, @Param("startDate") java.time.LocalDateTime startDate);
    
    // Recent bookings
    List<Booking> findTop5ByProviderOrderByCreatedAtDesc(ServiceProvider provider);
    
    // Upcoming bookings (today and future, pending or confirmed)
    @Query("SELECT b FROM Booking b WHERE b.provider = :provider AND b.bookingDate >= :today AND b.status IN ('PENDING', 'CONFIRMED') ORDER BY b.bookingDate ASC, b.bookingTime ASC")
    List<Booking> findUpcomingByProvider(@Param("provider") ServiceProvider provider, @Param("today") LocalDate today);
    
    // Admin queries
    List<Booking> findByStatus(BookingStatus status);
    
    long countByStatus(BookingStatus status);
    
    List<Booking> findTop10ByOrderByCreatedAtDesc();
    
    // Provider ID based queries
    List<Booking> findByProviderId(Long providerId);
    
    int countByProviderId(Long providerId);
    
    int countByProviderIdAndStatus(Long providerId, BookingStatus status);
    
    // Customer ID based queries  
    List<Booking> findByCustomerId(Long customerId);
    
    int countByCustomerId(Long customerId);
}
