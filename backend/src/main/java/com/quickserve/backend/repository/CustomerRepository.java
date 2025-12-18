package com.quickserve.backend.repository;

import com.quickserve.backend.model.Customer;
import com.quickserve.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Optional<Customer> findByUser(User user);

    Optional<Customer> findByUserId(Long userId);

    @Query("SELECT c FROM Customer c WHERE c.user.email = :email")
    Optional<Customer> findByUserEmail(@Param("email") String email);

    boolean existsByUserId(Long userId);

    @Query("SELECT c FROM Customer c JOIN FETCH c.user WHERE c.user.email = :email")
    Optional<Customer> findByUserEmailWithUser(@Param("email") String email);
}
