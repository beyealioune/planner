package planner.demo.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import planner.demo.Dtos.AvailabilityDTO;
import planner.demo.entities.Availability;
import planner.demo.entities.User;
import planner.demo.repository.AvailabilityRepository;
import planner.demo.repository.UserRepository;


import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvailabilityService {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private UserRepository userRepository;

    public List<AvailabilityDTO> getAvailabilityByUserId(Long userId) {
        return availabilityRepository.findByUserId(userId).stream()
                .map(AvailabilityDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public AvailabilityDTO saveAvailability(AvailabilityDTO availabilityDTO) {
        User user = userRepository.findById(availabilityDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Availability availability = AvailabilityDTO.toEntity(availabilityDTO);
        availability.setUser(user);
        Availability savedAvailability = availabilityRepository.save(availability);
        return AvailabilityDTO.fromEntity(savedAvailability);
    }

    public void deleteAvailability(Long id) {
        availabilityRepository.deleteById(id);
    }
}
