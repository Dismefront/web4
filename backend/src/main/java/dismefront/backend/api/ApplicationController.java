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

import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
    public ResponseEntity<Collection<Attempt>> tryAttempts(
            @RequestHeader("Authorization") String jwt,
            @RequestBody Collection<AttemptTry> attemptTries
    ) {
        Long start = System.currentTimeMillis();
        String email = getUsernameFromJWT(jwt.substring(7));
        if (email == null)
            return ResponseEntity.status(HttpStatus.LOCKED).build(); // 423
        User user = userRepository.findByEmail(email);
        if (user == null)
            return ResponseEntity.status(HttpStatus.LOCKED).build(); // 423
        ArrayList<Attempt> response = new ArrayList<>();
        for (AttemptTry Try : attemptTries) {
            tryAttempt(Try, user, start, response);
        }
        return ResponseEntity.ok(response);
    }

    public void tryAttempt(AttemptTry attemptTry, User user, Long start, ArrayList<Attempt> response) {
        if (!attemptTry.validateParams())
            return;
        Boolean result = attemptTry.getResult();
        Attempt attempt = new Attempt();

        SimpleDateFormat format = new SimpleDateFormat("MM/dd/yyyy hh:mm a");
        attempt.setIssuedDate(format.format(new Date()));
        attempt.setOwner(user);
        attempt.setR(attemptTry.getR());
        attempt.setX(attemptTry.getX());
        attempt.setY(attemptTry.getY());
        attempt.setResult(result);
        attempt.setExecutionTime(System.currentTimeMillis() - start);
        attemptsRepository.save(attempt);
        response.add(attempt);
    }

}
