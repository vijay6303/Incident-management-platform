package com.vijay.incident.service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.vijay.incident.dto.CreateIncidentRequest;
import com.vijay.incident.dto.UpdateIncidentRequest;
import com.vijay.incident.entity.Incident;
import com.vijay.incident.entity.IncidentStatus;
import com.vijay.incident.exception.IncidentNotFoundException;
import com.vijay.incident.repository.IncidentRepository;
import com.vijay.incident.security.CurrentUserService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class IncidentService {
    private final IncidentRepository repository;
    private final CurrentUserService currentUserService;
   public IncidentService(
            IncidentRepository repository,
            CurrentUserService currentUserService) {
        this.repository = repository;
        this.currentUserService = currentUserService;
    }
    public Page<Incident> getAll(
        IncidentStatus status,
        int page,
        int size,
        String sortBy,
        String direction) {

        if (page < 0) {
            throw new IllegalArgumentException("Page cannot be negative");
        }

        if (size < 1 || size > 100) {
            throw new IllegalArgumentException(
                    "Page size must be between 1 and 100");
        }

        if (!List.of("createdAt", "updatedAt", "title", "priority", "status")
                .contains(sortBy)) {
            throw new IllegalArgumentException("Invalid sort field");
        }

        Sort.Direction sortDirection;

        try {
            sortDirection = Sort.Direction.fromString(direction);
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException(
                    "Direction must be ASC or DESC");
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortDirection, sortBy)
        );

        if (status == null) {
            return repository.findAll(pageable);
        }

        return repository.findByStatus(status, pageable);
    }
   // @Cacheable(value = "incident", key = "#id")
    public Incident getById(Long id) {
        return repository.findById(id).orElseThrow(() -> new IncidentNotFoundException(id));
    }

    @Transactional
    public Incident create(CreateIncidentRequest request) {
        Incident incident = new Incident();
         String email = currentUserService.getCurrentUserEmail();
        incident.setReporterEmail(email);
        incident.setTitle(request.title().trim());
        incident.setDescription(request.description().trim());
        incident.setPriority(request.priority());
        incident.setStatus(IncidentStatus.OPEN);
        return repository.save(incident);
    }

    @Transactional
    @CacheEvict(value = "incident", key = "#id")
    public Incident update(Long id, UpdateIncidentRequest request) {
        Incident incident = getById(id);
        String currentEmail = currentUserService.getCurrentUserEmail();
        boolean isReporter = currentEmail != null
                && incident.getReporterEmail() != null
                && currentEmail.equalsIgnoreCase(incident.getReporterEmail());
        boolean isSupport = currentUserService.hasRole("SUPPORT");
        boolean isAdmin = currentUserService.hasRole("ADMIN");
        if (!isReporter && !isSupport && !isAdmin) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You are not allowed to update this incident"
            );
        }
        incident.setTitle(request.title().trim());
        incident.setDescription(request.description().trim());
        incident.setPriority(request.priority());
        incident.setStatus(request.status());
        if (isSupport || isAdmin) {
            incident.setAssigneeEmail(normalizeEmail(request.assigneeEmail()));
        }
        return repository.save(incident);
    }

    @CacheEvict(value = "incident", key = "#id")
    public void delete(Long id) {
        Incident incident = getById(id);
        repository.delete(incident);
    }

    private String normalizeEmail(String email) {
        return email == null || email.isBlank() ? null : email.trim().toLowerCase();
    }
}
