package planner.demo.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TokenSignerImpl implements TokenSigner {

    @Value("${secretToken}")
    private String SECRET_KEY;

    @Override
    public String signToken(String token) {
        return token;
    }
}