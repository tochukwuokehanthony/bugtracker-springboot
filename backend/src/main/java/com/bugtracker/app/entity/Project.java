package com.bugtracker.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"tickets", "teamMembers", "createdBy"})
@EqualsAndHashCode(exclude = {"tickets", "teamMembers", "createdBy"})
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "created_by")
    @JsonIgnoreProperties({"createdProjects", "createdTickets", "projects", "assignedTickets", "comments", "password"})
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties({"project", "createdBy", "comments", "assignedDevelopers"})
    private Set<Ticket> tickets = new HashSet<>();

    @ManyToMany(mappedBy = "projects")
    @JsonIgnoreProperties({"createdProjects", "createdTickets", "projects", "assignedTickets", "comments", "password"})
    private Set<User> teamMembers = new HashSet<>();
}