package dismefront.backend.api;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttemptTry {

    public boolean getResult() {
        boolean flag = false;
        if (r < 0) {
            x = -x;
            y = -y;
            r = -r;
            flag = true;
        }
        boolean result = (x <= 0 && y >= 0 && x * x + y * y <= r * r)
                || (x >= 0 && y >= 0 && x + y <= r / 2)
                || (x >= 0 && y <= 0 && -r <= y && x <= r / 2.0);
        if (flag) {
            x = -x;
            y = -y;
            r = -r;
        }
        return result;
    }

    private static boolean isInteger(Double variable) {
        if (variable.equals(Math.floor(variable)) &&
                !Double.isInfinite(variable) &&
                !Double.isNaN(variable) &&
                variable <= Integer.MAX_VALUE &&
                variable >= Integer.MIN_VALUE)
            return true;
        else
            return false;
    }

    public boolean validateParams() {
        return (x != null && y != null && r != null)
                && (-4 <= x && x <= 4)
                && (-5 < y && y < 5)
                && (isInteger(r) && -4 <= r && r <= 4);
    }

    private Double x, y, r;

}
