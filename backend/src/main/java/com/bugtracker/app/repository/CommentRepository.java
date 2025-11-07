package com.bugtracker.app.repository;

import com.bugtracker.app.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByTicketId(Long ticketId);

    List<Comment> findByUserId(Long userId);

    Long countByTicketId(Long ticketId);
}