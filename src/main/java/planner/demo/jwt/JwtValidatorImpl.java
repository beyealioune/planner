package planner.demo.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtValidatorImpl implements JwtValidator {

    private final JwtExtractor jwtExtractor;

    @Autowired
    public JwtValidatorImpl(JwtExtractor jwtExtractor) {
        this.jwtExtractor = jwtExtractor;
    }

    @Override
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = jwtExtractor.extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        return jwtExtractor.extractExpiration(token).before(new Date());
    }
}