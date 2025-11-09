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
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"createdProjects", "createdTickets", "projects", "assignedTickets", "comments"})
@EqualsAndHashCode(exclude = {"createdProjects", "createdTickets", "projects", "assignedTickets", "comments"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @JsonIgnore
    private String password;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "authority_level")
    private String authorityLevel = "USER";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationships
    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Project> createdProjects = new HashSet<>();

    @OneToMany(mappedBy = "createdBy", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Ticket> createdTickets = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "user_projects",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    @JsonIgnoreProperties({"createdBy", "tickets", "teamMembers"})
    private Set<Project> projects = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "dev_assignments",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "ticket_id")
    )
    @JsonIgnoreProperties({"project", "createdBy", "comments", "assignedDevelopers"})
    private Set<Ticket> assignedTickets = new HashSet<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Comment> comments = new HashSet<>();

    // Helper method to get full name
    public String getFullName() {
        return firstName + " " + lastName;
    }
}