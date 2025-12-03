package com.quickserve.backend.repository;

import com.quickserve.backend.model.ProviderService;
import com.quickserve.backend.model.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProviderServiceRepository extends JpaRepository<ProviderService, Long> {
    
    List<ProviderService> findByProviderOrderByCreatedAtDesc(ServiceProvider provider);
    
    List<ProviderService> findByProviderAndActiveTrue(ServiceProvider provider);
    
    List<ProviderService> findByProviderId(Long providerId);
    
    long countByProviderAndActiveTrue(ServiceProvider provider);
}
