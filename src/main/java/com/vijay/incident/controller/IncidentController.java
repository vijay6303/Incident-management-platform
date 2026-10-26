package com.vijay.incident.controller;

import com.vijay.incident.dto.CreateIncidentRequest;
import com.vijay.incident.dto.UpdateIncidentRequest;
import com.vijay.incident.entity.Incident;
import com.vijay.incident.entity.IncidentStatus;
import com.vijay.incident.service.IncidentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
public class IncidentController {
    private final IncidentService service;
    public IncidentController(IncidentService service) { this.service = service; }

    @GetMapping
    public Page<Incident> getAll(
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        return service.getAll(status, page, size, sortBy, direction);
    }

    @GetMapping("/{id}")
    public Incident getById(@PathVariable Long id) { return service.getById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Incident create(@Valid @RequestBody CreateIncidentRequest request) { return service.create(request); }

    @PutMapping("/{id}")
    public Incident update(@PathVariable Long id, @Valid @RequestBody UpdateIncidentRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
