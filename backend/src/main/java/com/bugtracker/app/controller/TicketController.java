package com.bugtracker.app.controller;

import com.bugtracker.app.dto.TicketDto;
import com.bugtracker.app.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping
    public ResponseEntity<List<TicketDto>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketDto> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TicketDto>> getTicketsByProjectId(@PathVariable Long projectId) {
        return ResponseEntity.ok(ticketService.getTicketsByProjectId(projectId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketDto>> getTicketsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ticketService.getTicketsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<TicketDto> createTicket(@Valid @RequestBody TicketDto ticketDto,
                                                   Authentication authentication) {
        String email = authentication.getName();
        TicketDto created = ticketService.createTicket(ticketDto, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TicketDto> updateTicket(@PathVariable Long id,
                                                   @Valid @RequestBody TicketDto ticketDto) {
        return ResponseEntity.ok(ticketService.updateTicket(id, ticketDto));
    }

    @PostMapping("/{ticketId}/assign/{userId}")
    public ResponseEntity<Void> assignDeveloper(@PathVariable Long ticketId, @PathVariable Long userId) {
        ticketService.assignDeveloper(ticketId, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{ticketId}/assign/{userId}")
    public ResponseEntity<Void> unassignDeveloper(@PathVariable Long ticketId, @PathVariable Long userId) {
        ticketService.unassignDeveloper(ticketId, userId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable Long id) {
        ticketService.deleteTicket(id);
        return ResponseEntity.noContent().build();
    }
}