package planner.demo.SecurityGlobal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * Configuration de la sécurité Web pour l'application.
 */
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

        @Autowired
        TokenFilter tokenFilter;


        /**
         * Configure la chaîne de filtres de sécurité pour l'application.
         *
         * @param http Objet HttpSecurity à configurer.
         * @return SecurityFilterChain configuré.
         * @throws Exception Si une erreur de configuration se produit.
         */
        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                        .csrf(csrf -> csrf.disable())
                        .authorizeHttpRequests((requests) -> requests
                                .requestMatchers("/api/auth/register","/api/auth/login","/images/**","/swagger-ui/**", "/v3/api-docs/**","/swagger-ui.html").permitAll()
                                .anyRequest().authenticated()
                        )
                        .addFilterBefore(tokenFilter, UsernamePasswordAuthenticationFilter.class);
                return http.build();
        }

        /**
         * Configure le filtre CORS pour permettre les requêtes Cross-Origin.
         *
         * @return CorsFilter configuré.
         */
        @Bean
        CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.applyPermitDefaultValues();
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**",configuration);
                return source;
        }

        /**
         * Crée un bean pour l'encodeur BCryptPasswordEncoder utilisé pour le cryptage des mots de passe.
         *
         * @return BCryptPasswordEncoder bean.
         */
        @Bean
        public BCryptPasswordEncoder bCryptPasswordEncoder(){

                return new BCryptPasswordEncoder();
        }

}
