package com.bugtracker.app.service;

import com.bugtracker.app.dto.TicketDto;
import com.bugtracker.app.entity.Project;
import com.bugtracker.app.entity.Ticket;
import com.bugtracker.app.entity.User;
import com.bugtracker.app.exception.ResourceNotFoundException;
import com.bugtracker.app.repository.CommentRepository;
import com.bugtracker.app.repository.ProjectRepository;
import com.bugtracker.app.repository.TicketRepository;
import com.bugtracker.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    public List<TicketDto> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public TicketDto getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        return convertToDto(ticket);
    }

    public List<TicketDto> getTicketsByProjectId(Long projectId) {
        return ticketRepository.findByProjectId(projectId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TicketDto> getTicketsByUserId(Long userId) {
        return ticketRepository.findTicketsByAssignedDeveloperId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TicketDto createTicket(TicketDto ticketDto, String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = projectRepository.findById(ticketDto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Ticket ticket = new Ticket();
        ticket.setTitle(ticketDto.getTitle());
        ticket.setDescription(ticketDto.getDescription());
        ticket.setProject(project);
        ticket.setCreatedBy(creator);
        ticket.setPriority(ticketDto.getPriority() != null ? ticketDto.getPriority() : "MEDIUM");
        ticket.setStatus(ticketDto.getStatus() != null ? ticketDto.getStatus() : "OPEN");
        ticket.setType(ticketDto.getType() != null ? ticketDto.getType() : "BUG");
        ticket.setTimeEstimate(ticketDto.getTimeEstimate());

        ticket = ticketRepository.save(ticket);
        return convertToDto(ticket);
    }

    @Transactional
    public TicketDto updateTicket(Long id, TicketDto ticketDto) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        ticket.setTitle(ticketDto.getTitle());
        ticket.setDescription(ticketDto.getDescription());
        ticket.setPriority(ticketDto.getPriority());
        ticket.setStatus(ticketDto.getStatus());
        ticket.setType(ticketDto.getType());
        ticket.setTimeEstimate(ticketDto.getTimeEstimate());

        ticket = ticketRepository.save(ticket);
        return convertToDto(ticket);
    }

    @Transactional
    public void assignDeveloper(Long ticketId, Long userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ticket.getAssignedDevelopers().add(user);
        user.getAssignedTickets().add(ticket);
        ticketRepository.save(ticket);
    }

    @Transactional
    public void unassignDeveloper(Long ticketId, Long userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ticket.getAssignedDevelopers().remove(user);
        user.getAssignedTickets().remove(ticket);
        ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
        ticketRepository.delete(ticket);
    }

    private TicketDto convertToDto(Ticket ticket) {
        TicketDto dto = new TicketDto();
        dto.setId(ticket.getId());
        dto.setTitle(ticket.getTitle());
        dto.setDescription(ticket.getDescription());
        dto.setProjectId(ticket.getProject().getId());
        dto.setProjectName(ticket.getProject().getName());
        if (ticket.getCreatedBy() != null) {
            dto.setCreatedById(ticket.getCreatedBy().getId());
            dto.setCreatedByName(ticket.getCreatedBy().getFullName());
        }
        dto.setPriority(ticket.getPriority());
        dto.setStatus(ticket.getStatus());
        dto.setType(ticket.getType());
        dto.setTimeEstimate(ticket.getTimeEstimate());
        dto.setCreatedAt(ticket.getCreatedAt());
        dto.setUpdatedAt(ticket.getUpdatedAt());

        Set<Long> assignedDevIds = ticket.getAssignedDevelopers().stream()
                .map(User::getId)
                .collect(Collectors.toSet());
        dto.setAssignedDeveloperIds(assignedDevIds);

        Long commentCount = commentRepository.countByTicketId(ticket.getId());
        dto.setCommentCount(commentCount.intValue());

        return dto;
    }
}