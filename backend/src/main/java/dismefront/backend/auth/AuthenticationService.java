package dismefront.backend.auth;

import dismefront.backend.model.Role;
import dismefront.backend.model.Roles;
import dismefront.backend.model.User;
import dismefront.backend.repos.UserRepository;
import dismefront.backend.secutity.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;
    private final JwtService service;

    private final AuthenticationManager authenticationManager;

    public boolean validateRegister(RegisterRequest request) {
        User user = repository.findByEmail(request.getEmail());
        return user == null;
    }

    public AuthenticationResponse googleAuth(RegisterRequest request) {
        if (validateRegister(request))
            return register(request);
        else {
            AuthenticationRequest ar = new AuthenticationRequest();
            ar.setEmail(request.getEmail());
            ar.setPassword(request.getPassword());
            return authenticate(ar);
        }
    }

    public AuthenticationResponse register(RegisterRequest request) {
        Role standardRole = new Role();
        standardRole.setAuthority(Roles.STANDARD);
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(encoder.encode(request.getPassword()))
                .roles(List.of(standardRole))
                .build();
        repository.save(user);
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());
        claims.put("role", user.getAuthorities());
        String jwtToken = service.generateToken(claims, user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = repository.findByEmail(request.getEmail());
        if (user == null)
            throw new UsernameNotFoundException("No user found");
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("name", user.getName());
        claims.put("role", user.getAuthorities());
        String jwtToken = service.generateToken(claims, user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

}
