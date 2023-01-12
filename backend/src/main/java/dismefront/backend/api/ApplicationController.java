package dismefront.backend.api;

import dismefront.backend.model.Attempt;
import dismefront.backend.model.User;
import dismefront.backend.repos.AttemptsRepository;
import dismefront.backend.repos.UserRepository;
import dismefront.backend.secutity.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/attempts")
@RequiredArgsConstructor
public class ApplicationController {

    private final UserRepository userRepository;
    private final AttemptsRepository attemptsRepository;
    private final JwtService jwtService;

    private String getUsernameFromJWT(String jwt) {
        String email;
        try {
            email = jwtService.extractUsername(jwt);
        }
        catch(Exception ex) {
            email = null;
        }
        return email;
    }

    @GetMapping("/get")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Collection<Attempt>> getAttempts(
            @RequestHeader("Authorization") String jwt
    ) {
        String email = getUsernameFromJWT(jwt.substring(7));
        if (email == null)
            return ResponseEntity.status(HttpStatus.LOCKED).build(); // 423
        User user = userRepository.findByEmail(email);
        if (user == null)
            return ResponseEntity.status(HttpStatus.LOCKED).build(); // 423
        return ResponseEntity.ok(user.getAttempts());
    }

    @PostMapping("/try")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<Attempt> tryAttempt(
            @RequestHeader("Authorization") String jwt,
            @RequestBody AttemptTry attemptTry
    ) {
        Long start = System.currentTimeMillis();
        String email = getUsernameFromJWT(jwt.substring(7));
        if (email == null)
            return ResponseEntity.status(HttpStatus.LOCKED).build(); // 423
        User user = userRepository.findByEmail(email);
        if (user == null)
            return ResponseEntity.status(HttpStatus.LOCKED).build(); // 423
        if (!attemptTry.validateParams())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        Boolean result = attemptTry.getResult();
        Attempt attempt = new Attempt();
        attempt.setIssuedDate(new Date());
        attempt.setOwner(user);
        attempt.setR(attemptTry.getR());
        attempt.setX(attemptTry.getX());
        attempt.setY(attemptTry.getY());
        attempt.setResult(result);
        attempt.setExecutionTime(start - System.currentTimeMillis());
        attemptsRepository.save(attempt);
        return ResponseEntity.ok(attempt);
    }

}
