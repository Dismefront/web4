package dismefront.backend.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GooglePayload {

    private String name;
    private String email;
    private String sub;

}
