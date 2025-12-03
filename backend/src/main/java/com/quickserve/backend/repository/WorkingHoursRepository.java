package com.quickserve.backend.repository;

import com.quickserve.backend.model.ServiceProvider;
import com.quickserve.backend.model.WorkingHours;
import com.quickserve.backend.model.enums.DayOfWeek;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkingHoursRepository extends JpaRepository<WorkingHours, Long> {
    
    List<WorkingHours> findByProviderOrderByDayOfWeek(ServiceProvider provider);
    
    Optional<WorkingHours> findByProviderAndDayOfWeek(ServiceProvider provider, DayOfWeek dayOfWeek);
    
    void deleteByProvider(ServiceProvider provider);
}
