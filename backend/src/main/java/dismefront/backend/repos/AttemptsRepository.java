package dismefront.backend.repos;

import dismefront.backend.model.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttemptsRepository extends JpaRepository<Attempt, Long> {
}
