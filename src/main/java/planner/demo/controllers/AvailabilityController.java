package planner.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import planner.demo.Dtos.AvailabilityDTO;
import planner.demo.services.AvailabilityService;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/availabilities")
public class AvailabilityController {

    @Autowired
    private AvailabilityService availabilityService;

    @GetMapping("/user/{userId}")
    public List<AvailabilityDTO> getUserAvailabilities(@PathVariable Long userId) {
        return availabilityService.getAvailabilityByUserId(userId);
    }

    @PostMapping
    public AvailabilityDTO addAvailability(@RequestBody AvailabilityDTO availabilityDTO) {
        return availabilityService.saveAvailability(availabilityDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
    }
}

