package dismefront.backend.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/google")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<AuthenticationResponse> googleSign(
            @RequestBody GooglePayload payload
    ) {
        String name = payload.getName();
        String email = payload.getEmail();
        String sub = payload.getSub();
        if (name == null || name.isBlank() || email == null || email.isBlank())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        RegisterRequest rr = new RegisterRequest();
        rr.setEmail(email);
        rr.setPassword("potom_pofixu");
        rr.setName(name);
        return ResponseEntity.ok(service.googleAuth(rr));
    }

    @PostMapping("/register")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        if (request.getEmail() == null || request.getEmail().isBlank()
                || request.getName() == null || request.getName().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        if (!service.validateRegister(request))
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

}
