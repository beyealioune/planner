package planner.demo.SecurityGlobal;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import planner.demo.entities.User;
import planner.demo.jwt.JwtExtractor;
import planner.demo.jwt.JwtValidator;
import planner.demo.repository.UserRepository;

import java.io.IOException;
import java.util.Optional;

/**
 * Filtre pour la validation et l'extraction des jetons JWT dans les requêtes.
 */
@Component
public class TokenFilter extends OncePerRequestFilter {

    @Autowired
    JwtExtractor jwtExtractor;
    @Autowired
    JwtValidator jwtValidator;


    @Autowired
    UserRepository userRepository;

    /**
     * Intercepte chaque requête HTTP pour extraire et valider le jeton JWT.
     *
     * @param request     HttpServletRequest représentant la requête HTTP.
     * @param response    HttpServletResponse représentant la réponse HTTP.
     * @param filterChain FilterChain pour continuer la chaîne de filtres.
     * @throws ServletException Si une erreur de servlet se produit.
     * @throws IOException      Si une erreur d'entrée/sortie se produit.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer")) {
            String jwt = header.substring(7);
            String mail = jwtExtractor.extractUsername(jwt);

            Optional<User> userOptional = userRepository.findByEmail(mail);

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                if (jwtValidator.validateToken(jwt, (UserDetails) user)) {
                    SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(user, null, ((UserDetails) user).getAuthorities()));
                }
            }
        }

        filterChain.doFilter(request, response);
    }

}
