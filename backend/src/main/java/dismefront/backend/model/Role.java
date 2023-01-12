package dismefront.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="roles")
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    private String authority;

    public void setAuthority(Roles authority) {
        this.authority = authority.name();
    }

    @Override
    public String getAuthority() {
        return authority;
    }

    @ManyToMany(mappedBy = "roles", fetch = FetchType.LAZY)
    private List<User> users;

}
