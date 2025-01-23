package planner.demo.jwt;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtGenerator {
    String generateToken(UserDetails userDetails);
}