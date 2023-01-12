package dismefront.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name="attempts")
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Double x;
    private Double y;
    private Double r;

    private Boolean result;

    private Date issuedDate;
    private Long executionTime;

    @JsonIgnore
    @ManyToOne
    private User owner;

}