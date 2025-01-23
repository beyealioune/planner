package planner.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import planner.demo.entities.Availability;

import java.util.List;

public interface AvailabilityRepository extends JpaRepository<Availability, Long> {

    List<Availability> findByUserId(Long userId);
}
