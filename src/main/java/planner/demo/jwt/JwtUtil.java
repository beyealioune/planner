package planner.demo.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Service pour la génération, la validation et l'extraction des jetons JWT (JSON Web Tokens).
 */
@Service
public class JwtUtil implements JwtExtractor{

    private final TokenSigner tokenSigner;
    private final JwtExtractor jwtExtractor;

    @Value("${secretToken}")
    private String SECRET_KEY;

    @Autowired
    public JwtUtil(TokenSigner tokenSigner, JwtExtractor jwtExtractor) {
        this.tokenSigner = tokenSigner;
        this.jwtExtractor = jwtExtractor;
    }

    /**
     * Extrait le nom d'utilisateur à partir du jeton JWT.
     * @param token Jeton JWT à partir duquel extraire le nom d'utilisateur.
     * @return Le nom d'utilisateur extrait du jeton JWT.
     */
    public String extractUsername(String token) {
        return jwtExtractor.extractUsername(token);
    }

    public Date extractExpiration(String token) {
        return jwtExtractor.extractExpiration(token);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return jwtExtractor.extractClaim(token, claimsResolver);
    }

    /**
     * Génère un jeton JWT pour un utilisateur authentifié.
     * @param userDetails Informations de l'utilisateur authentifié.
     * @return Le jeton JWT généré.
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        String token = tokenSigner.signToken(createToken(claims, userDetails.getUsername()));
        System.out.println("Jeton généré : " + token); // Affichez le jeton ici
        return token;
    }


    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
}
