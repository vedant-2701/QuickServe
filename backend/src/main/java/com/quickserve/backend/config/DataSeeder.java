package com.quickserve.backend.config;

import com.quickserve.backend.model.User;
import com.quickserve.backend.model.enums.Role;
import com.quickserve.backend.model.enums.AccountStatus;
import com.quickserve.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin already exists
            if (userRepository.findByEmail("admin@quickserve.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@quickserve.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setFullName("System Admin");
                admin.setPhone("9999999999");
                admin.setRole(Role.ADMIN);
                admin.setStatus(AccountStatus.ACTIVE);
                
                userRepository.save(admin);
                System.out.println("✅ Admin user created: admin@quickserve.com / admin123");
            } else {
                System.out.println("ℹ️ Admin user already exists");
            }
        };
    }
}
