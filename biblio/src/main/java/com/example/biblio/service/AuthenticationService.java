    package com.example.biblio.service;

    import com.example.biblio.model.AuthenticationRequest;
    import com.example.biblio.model.RegisterRequest;
    import com.example.biblio.model.Role;
    import com.example.biblio.model.User;
    import com.example.biblio.repository.UserRepository;
    import com.example.biblio.responses.AuthenticationResponse;
    import com.example.biblio.security.jwt.JwtService;
    import lombok.RequiredArgsConstructor;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.AuthenticationException;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.stereotype.Service;

    @Service
    @RequiredArgsConstructor
    public class AuthenticationService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        public AuthenticationResponse register(RegisterRequest request) {
            var user = User.builder()
                    .name(request.getName())
                    .lastname(request.getLastname())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(request.getRole())
                    .build();
            if(!userRepository.existsByEmail(request.getEmail())){
                userRepository.save(user);
                var jwtToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder().token(jwtToken).build();
            }else{
                throw new RuntimeException("Email already exists");
            }

        }

        public AuthenticationResponse authenticate(AuthenticationRequest request) {
            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
                );
            } catch (AuthenticationException e) {
                System.out.println("Authentication failed: " + e.getMessage());
                throw e;
            }
            //get user
            var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
            var jwtToken = jwtService.generateToken(user);//generate token
            return AuthenticationResponse.builder().token(jwtToken).build();
        }
    }
