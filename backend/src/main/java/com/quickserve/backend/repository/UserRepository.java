package com.quickserve.backend.repository;

import com.quickserve.backend.model.User;
import com.quickserve.backend.model.enums.AccountStatus;
import com.quickserve.backend.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByPhone(String phone);
    
    boolean existsByEmail(String email);
    
    boolean existsByPhone(String phone);
    
    // Role-based queries
    List<User> findByRole(Role role);
    
    List<User> findByStatus(AccountStatus status);
    
    List<User> findByRoleAndStatus(Role role, AccountStatus status);
    
    long countByRole(Role role);
    
    long countByRoleAndStatus(Role role, AccountStatus status);
    
    // Recent users
    List<User> findTop10ByOrderByCreatedAtDesc();
}
