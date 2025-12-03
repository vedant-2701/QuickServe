package com.quickserve.backend.repository;

import com.quickserve.backend.model.ServiceProvider;
import com.quickserve.backend.model.User;
import com.quickserve.backend.model.enums.ServiceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    
    Optional<ServiceProvider> findByUserId(Long userId);
    
    Optional<ServiceProvider> findByUser(User user);
    
    List<ServiceProvider> findByPrimaryService(ServiceCategory category);
    
    List<ServiceProvider> findByCity(String city);
    
    @Query("SELECT sp FROM ServiceProvider sp WHERE sp.city = :city AND sp.primaryService = :category AND sp.isAvailable = true")
    List<ServiceProvider> findAvailableProvidersByCityAndCategory(@Param("city") String city, @Param("category") ServiceCategory category);
    
    boolean existsByAadharNumber(String aadharNumber);
}
