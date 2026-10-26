package com.vijay.incident.service;
import com.vijay.incident.security.CurrentUserService;
import org.mockito.Mock;
import com.vijay.incident.entity.IncidentStatus;
import com.vijay.incident.repository.IncidentRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentServiceTest {

    @Mock
    private IncidentRepository repository;

    private IncidentService service;
    @Mock
    private CurrentUserService currentUserService;
    @BeforeEach
    void setUp() {
        service = new IncidentService(repository, currentUserService);
    }

    @Test
    void getAllWithoutStatusReturnsPageOfIncidents() {
        when(repository.findAll(any(Pageable.class)))
                .thenAnswer(invocation ->
                        Page.empty(invocation.getArgument(0)));

        Page<?> result = service.getAll(
                null, 0, 10, "createdAt", "desc");

        assertNotNull(result);
        assertEquals(0, result.getTotalElements());

        verify(repository).findAll(any(Pageable.class));
    }

    @Test
    void getAllWithStatusFiltersIncidents() {
        when(repository.findByStatus(
                eq(IncidentStatus.OPEN), any(Pageable.class)))
                .thenAnswer(invocation ->
                        Page.empty(invocation.getArgument(1)));

        Page<?> result = service.getAll(
                IncidentStatus.OPEN, 0, 10, "createdAt", "desc");

        assertNotNull(result);

        verify(repository).findByStatus(
                eq(IncidentStatus.OPEN), any(Pageable.class));

        verify(repository, never()).findAll(any(Pageable.class));
    }

    @Test
    void getAllRejectsNegativePageNumber() {
        assertThrows(
                IllegalArgumentException.class,
                () -> service.getAll(
                        null, -1, 10, "createdAt", "desc")
        );

        verifyNoInteractions(repository);
    }

    @Test
    void getAllRejectsPageSizeAboveLimit() {
        assertThrows(
                IllegalArgumentException.class,
                () -> service.getAll(
                        null, 0, 101, "createdAt", "desc")
        );

        verifyNoInteractions(repository);
    }
}