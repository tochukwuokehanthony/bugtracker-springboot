package com.bugtracker.app.repository;

import com.bugtracker.app.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByProjectId(Long projectId);

    List<Ticket> findByCreatedById(Long userId);

    @Query("SELECT DISTINCT t FROM Ticket t JOIN t.assignedDevelopers u WHERE u.id = :userId")
    List<Ticket> findTicketsByAssignedDeveloperId(Long userId);

    List<Ticket> findByStatus(String status);

    List<Ticket> findByPriority(String priority);

    List<Ticket> findByType(String type);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.project.id = :projectId")
    Long countByProjectId(Long projectId);
}