package com.quickserve.backend.serviceImpl;

import com.quickserve.backend.dto.request.LoginRequest;
import com.quickserve.backend.dto.request.SignupRequest;
import com.quickserve.backend.dto.request.customer.CustomerSignupRequest;
import com.quickserve.backend.dto.response.AuthResponse;
import com.quickserve.backend.exception.BadRequestException;
import com.quickserve.backend.exception.ResourceNotFoundException;
import com.quickserve.backend.model.Customer;
import com.quickserve.backend.model.ServiceProvider;
import com.quickserve.backend.model.User;
import com.quickserve.backend.model.enums.AccountStatus;
import com.quickserve.backend.model.enums.Role;
import com.quickserve.backend.model.enums.ServiceCategory;
import com.quickserve.backend.repository.CustomerRepository;
import com.quickserve.backend.repository.ServiceProviderRepository;
import com.quickserve.backend.repository.UserRepository;
import com.quickserve.backend.security.JwtTokenProvider;
import com.quickserve.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final ServiceProviderRepository serviceProviderRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            if (user.getStatus() == AccountStatus.SUSPENDED) {
                throw new BadRequestException("Your account has been suspended. Please contact support.");
            }

            if (user.getStatus() == AccountStatus.DEACTIVATED) {
                throw new BadRequestException("Your account has been deactivated.");
            }

            String accessToken = tokenProvider.generateToken(authentication);
            String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

            return buildAuthResponse(user, accessToken, refreshToken);

        } catch (BadCredentialsException e) {
            throw new BadRequestException("Invalid email or password");
        }
    }

    @Override
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Check if phone already exists
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number is already registered");
        }

        // Check if Aadhar already exists
        if (serviceProviderRepository.existsByAadharNumber(request.getAadharNumber())) {
            throw new BadRequestException("Aadhar number is already registered");
        }

        // Create User
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.SERVICE_PROVIDER)
                .status(AccountStatus.PENDING_VERIFICATION)
                .build();

        user = userRepository.save(user);

        // Parse primary service category
        ServiceCategory primaryCategory = parseServiceCategory(request.getPrimaryService());

        // Parse secondary service categories
        List<ServiceCategory> secondaryCategories = new ArrayList<>();
        if (request.getSecondaryServices() != null) {
            for (String service : request.getSecondaryServices()) {
                try {
                    secondaryCategories.add(parseServiceCategory(service));
                } catch (Exception ignored) {
                    // Skip invalid service categories
                }
            }
        }

        // Create ServiceProvider
        ServiceProvider provider = ServiceProvider.builder()
                .user(user)
                .aadharNumber(request.getAadharNumber().replaceAll("\\s", ""))
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .primaryService(primaryCategory)
                .secondaryServices(secondaryCategories)
                .experienceYears(request.getExperience())
                .serviceRadiusKm(request.getServiceRadius() != null ? request.getServiceRadius() : 5)
                .hourlyRate(request.getHourlyRate())
                .bio(request.getBio())
                .languages(request.getLanguages() != null ? request.getLanguages() : new ArrayList<>())
                .build();

        provider = serviceProviderRepository.save(provider);

        // Generate tokens
        String accessToken = tokenProvider.generateToken(user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        log.info("New service provider registered: {}", user.getEmail());

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Override
    @Transactional
    public AuthResponse signupCustomer(CustomerSignupRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        // Check if phone already exists
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number is already registered");
        }

        // Create User with CUSTOMER role
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .status(AccountStatus.ACTIVE) // Customers are active immediately
                .build();

        user = userRepository.save(user);

        // Create Customer profile
        Customer customer = Customer.builder()
                .user(user)
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .totalBookings(0)
                .completedBookings(0)
                .cancelledBookings(0)
                .build();

        customerRepository.save(customer);

        // Generate tokens
        String accessToken = tokenProvider.generateToken(user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        log.info("New customer registered: {}", user.getEmail());

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        String email = tokenProvider.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newAccessToken = tokenProvider.generateToken(email);
        String newRefreshToken = tokenProvider.generateRefreshToken(email);

        return buildAuthResponse(user, newAccessToken, newRefreshToken);
    }

    @Override
    public void logout(String email) {
        // In a stateless JWT setup, logout is typically handled client-side
        // by removing the token. For enhanced security, you can implement
        // a token blacklist using Redis or database.
        log.info("User logged out: {}", email);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        Long providerId = null;
        Long customerId = null;
        
        if (user.getRole() == Role.SERVICE_PROVIDER) {
            ServiceProvider provider = serviceProviderRepository.findByUserId(user.getId()).orElse(null);
            if (provider != null) {
                providerId = provider.getId();
            }
        } else if (user.getRole() == Role.CUSTOMER) {
            Customer customer = customerRepository.findByUserId(user.getId()).orElse(null);
            if (customer != null) {
                customerId = customer.getId();
            }
        }

        AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .providerId(providerId)
                .customerId(customerId)
                .build();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationInSeconds())
                .user(userInfo)
                .build();
    }

    private ServiceCategory parseServiceCategory(String service) {
        if (service == null || service.isBlank()) {
            throw new BadRequestException("Service category is required");
        }
        
        String normalized = service.toUpperCase()
                .replace(" ", "_")
                .replace("-", "_");
        
        try {
            return ServiceCategory.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            // Try matching by display name
            for (ServiceCategory category : ServiceCategory.values()) {
                if (category.getDisplayName().equalsIgnoreCase(service)) {
                    return category;
                }
            }
            throw new BadRequestException("Invalid service category: " + service);
        }
    }
}
