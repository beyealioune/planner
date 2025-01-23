package planner.demo.controllers;



import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import planner.demo.Dtos.UserDTO;
import planner.demo.entities.User;
import planner.demo.jwt.JwtUtil;
import planner.demo.repository.UserRepository;
import planner.demo.services.AuthService;
import planner.demo.services.RegisterService;
import planner.demo.services.UserService;

import java.util.HashMap;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/")
public class AuthController {



    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private RegisterService registerService;

    @Autowired
    private UserService userService;

    @Autowired
    JwtUtil jwtUtil;

    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("auth/register")
    public ResponseEntity<User> register(@RequestBody UserDTO userDTO) {
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());

        User registeredUser = registerService.register(user);
        return ResponseEntity.ok(registeredUser);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @PostMapping("auth/login")
    public HashMap loginUser(@RequestBody UserDTO userDTO) {

        return authService.loginUser(userDTO);
    }

    @CrossOrigin(origins = "http://localhost:4200")
    @GetMapping("auth/me")
    public UserDTO getMe() {

        return userService.getMe();
    }

}