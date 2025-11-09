package com.bugtracker.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"project", "createdBy", "comments", "assignedDevelopers"})
@EqualsAndHashCode(exclude = {"project", "createdBy", "comments", "assignedDevelopers"})
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnoreProperties({"tickets", "teamMembers", "createdBy"})
    private Project project;

    @ManyToOne
    @JoinColumn(name = "created_by")
    @JsonIgnoreProperties({"createdProjects", "createdTickets", "projects", "assignedTickets", "comments", "password"})
    private User createdBy;

    @Column(nullable = false)
    private String priority = "MEDIUM";

    @Column(nullable = false)
    private String status = "OPEN";

    @Column(nullable = false)
    private String type = "BUG";

    @Column(name = "time_estimate")
    private Integer timeEstimate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Set<Comment> comments = new HashSet<>();

    @ManyToMany(mappedBy = "assignedTickets")
    @JsonIgnoreProperties({"createdProjects", "createdTickets", "projects", "assignedTickets", "comments", "password"})
    private Set<User> assignedDevelopers = new HashSet<>();
}