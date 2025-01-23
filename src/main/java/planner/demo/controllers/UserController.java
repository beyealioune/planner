package planner.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import planner.demo.Dtos.UserDTO;
import planner.demo.entities.User;
import planner.demo.services.UserService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public UserDTO getUserProfile(@PathVariable Long userId) {
        return userService.getUserProfile(userId);
    }

    @GetMapping("/username/{username}")
    public UserDTO getUserProfileByUsername(@PathVariable String username) {
        return userService.getUserProfileByUsername(username);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PutMapping("/auth/me")
    public ResponseEntity<UserDTO> updateUserProfile(@RequestBody UserDTO userDTO) {
        String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional<User> currentUser = userService.findByEmail(currentEmail);

        if (currentUser.isPresent()) {
            UserDTO updatedUser = userService.updateUserProfile(currentUser.get().getId(), userDTO.getUsername(), userDTO.getEmail());
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping
    public UserDTO createUser(@RequestBody UserDTO userDTO) {
        return userService.saveUser(userDTO);
    }

    @PutMapping("/{id}/subscribe/{subscriberId}")
    public void subscribe(@PathVariable Long id, @PathVariable Long subscriberId) {
        userService.subscribe(id, subscriberId);
    }

    @PutMapping("/{id}/unsubscribe/{subscriberId}")
    public void unsubscribe(@PathVariable Long id, @PathVariable Long subscriberId) {
        userService.unsubscribe(id, subscriberId);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
