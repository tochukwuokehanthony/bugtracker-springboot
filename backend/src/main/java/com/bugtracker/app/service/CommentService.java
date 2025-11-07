package com.bugtracker.app.service;

import com.bugtracker.app.dto.CommentDto;
import com.bugtracker.app.entity.Comment;
import com.bugtracker.app.entity.Ticket;
import com.bugtracker.app.entity.User;
import com.bugtracker.app.exception.ResourceNotFoundException;
import com.bugtracker.app.repository.CommentRepository;
import com.bugtracker.app.repository.TicketRepository;
import com.bugtracker.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    public List<CommentDto> getCommentsByTicketId(Long ticketId) {
        return commentRepository.findByTicketId(ticketId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CommentDto getCommentById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
        return convertToDto(comment);
    }

    @Transactional
    public CommentDto createComment(CommentDto commentDto, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Ticket ticket = ticketRepository.findById(commentDto.getTicketId())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        Comment comment = new Comment();
        comment.setContent(commentDto.getContent());
        comment.setTicket(ticket);
        comment.setUser(user);

        comment = commentRepository.save(comment);
        return convertToDto(comment);
    }

    @Transactional
    public CommentDto updateComment(Long id, CommentDto commentDto) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));

        comment.setContent(commentDto.getContent());
        comment = commentRepository.save(comment);
        return convertToDto(comment);
    }

    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
        commentRepository.delete(comment);
    }

    private CommentDto convertToDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setTicketId(comment.getTicket().getId());
        dto.setUserId(comment.getUser().getId());
        dto.setUserName(comment.getUser().getFullName());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}