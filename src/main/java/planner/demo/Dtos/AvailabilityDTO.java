package planner.demo.Dtos;


import lombok.Data;
import planner.demo.entities.Availability;

import java.time.LocalDate;

@Data
public class AvailabilityDTO {

    private Long id;
    private Long userId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    private LocalDate date;
    private boolean isAvailable;

    // Getters and Setters
    // ...

    public static AvailabilityDTO fromEntity(Availability availability) {
        AvailabilityDTO dto = new AvailabilityDTO();
        dto.setId(availability.getId());
        dto.setUserId(availability.getUser().getId());
        dto.setDate(availability.getDate());
        dto.setAvailable(availability.isAvailable());
        return dto;
    }

    public static Availability toEntity(AvailabilityDTO dto) {
        Availability availability = new Availability();
        availability.setId(dto.getId());
        availability.setDate(dto.getDate());
        availability.setAvailable(dto.isAvailable());
        return availability;
    }
}
