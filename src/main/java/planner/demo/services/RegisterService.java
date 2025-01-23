package planner.demo.services;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import planner.demo.Exceptions.RegistrationException;
import planner.demo.entities.User;
import planner.demo.repository.UserRepository;

/**
 * Service pour la gestion de l'enregistrement des utilisateurs.
 */
@Service
public class RegisterService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    /**
     * Enregistre un nouvel utilisateur après avoir vérifié l'unicité de l'email et crypté le mot de passe.
     *
     * @param user l'utilisateur à enregistrer.
     * @return l'utilisateur enregistré.
     * @throws RegistrationException si l'email est déjà utilisé.
     */
    public User register(User user) {
        // Vérifier si l'email est déjà utilisé
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RegistrationException("Email already exists");
        }

        // Crypter le mot de passe avant de l'assigner à l'utilisateur
        String encryptedPassword = bCryptPasswordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);

        // Enregistrer l'utilisateur dans la base de données
        return userRepository.save(user);
    }

}