package com.quickserve.backend.repository;

import com.quickserve.backend.model.Customer;
import com.quickserve.backend.model.SavedAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedAddressRepository extends JpaRepository<SavedAddress, Long> {

    List<SavedAddress> findByCustomerOrderByIsDefaultDescCreatedAtDesc(Customer customer);

    Optional<SavedAddress> findByCustomerAndIsDefaultTrue(Customer customer);

    Optional<SavedAddress> findByIdAndCustomer(Long id, Customer customer);

    int countByCustomer(Customer customer);
}
