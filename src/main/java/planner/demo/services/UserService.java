package planner.demo.services;


import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import planner.demo.Dtos.UserDTO;
import planner.demo.entities.User;
import planner.demo.repository.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public UserDTO getUserProfile(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(UserDTO::fromEntity).orElse(null);
    }

    public UserDTO getUserProfileByUsername(String username) {
        User user = userRepository.findByUsername(username);
        return user != null ? UserDTO.fromEntity(user) : null;
    }

    public UserDTO getMe() {
        try {
            String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            Optional<User> user = userRepository.findByEmail(userEmail);
            if (!user.isPresent()) {
                throw new EntityNotFoundException("User not found with email: " + userEmail);
            }
            UserDTO userDTO = UserDTO.fromEntity(user.get());
            userDTO.setPassword(null); // Supprimer le mot de passe du DTO
            return userDTO;
        } catch (EntityNotFoundException ex) {
            throw ex; // Laisser l'exception EntityNotFoundException être propagée
        } catch (Exception ex) {
            throw new RuntimeException("Failed to fetch user details", ex); // Capturer et lancer une exception plus générale
        }
    }

    public UserDTO updateUserProfile(Long userId, String newUsername, String newEmail) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new EntityNotFoundException("User not found with ID: " + userId);
        }

        User user = userOptional.get();
        user.setUsername(newUsername);
        user.setEmail(newEmail);
        userRepository.save(user);

        return UserDTO.fromEntity(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }



    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream().map(UserDTO::fromEntity).collect(Collectors.toList());
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return UserDTO.fromEntity(user);
    }

    public UserDTO saveUser(UserDTO userDTO) {
        User user = UserDTO.toEntity(userDTO);
        User savedUser = userRepository.save(user);
        return UserDTO.fromEntity(savedUser);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public void subscribe(Long userId, Long subscriberId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User subscriber = userRepository.findById(subscriberId).orElseThrow(() -> new RuntimeException("Subscriber not found"));
        user.getSubscribers().add(subscriber);
        userRepository.save(user);
    }

    public void unsubscribe(Long userId, Long subscriberId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        User subscriber = userRepository.findById(subscriberId).orElseThrow(() -> new RuntimeException("Subscriber not found"));
        user.getSubscribers().remove(subscriber);
        userRepository.save(user);
    }
}
