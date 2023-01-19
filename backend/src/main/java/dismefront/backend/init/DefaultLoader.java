package dismefront.backend.init;

import dismefront.backend.model.Attempt;
import dismefront.backend.model.Role;
import dismefront.backend.model.Roles;
import dismefront.backend.model.User;
import dismefront.backend.repos.AttemptsRepository;
import dismefront.backend.repos.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DefaultLoader {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AttemptsRepository attemptsRepository;

    @Bean
    public void LoadDefaultAdmins() {
        Role standardRole = new Role();
        standardRole.setAuthority(Roles.STANDARD);
        Role adminRole = new Role();
        adminRole.setAuthority(Roles.ADMIN);
        Role superAdminRole = new Role();
        superAdminRole.setAuthority(Roles.SUPER_ADMIN);
        User user = User.builder()
                .name("superadmin")
                .email("superadmin")
                .password(encoder.encode("superadmin"))
                .roles(List.of(standardRole, adminRole, superAdminRole))
                .build();

        Attempt attempt = new Attempt(null, 1.0, 2.0, 3.0, true, "00:00 Jesus time", 100l, user);

        userRepository.save(user);
        attemptsRepository.save(attempt);
    }

}
