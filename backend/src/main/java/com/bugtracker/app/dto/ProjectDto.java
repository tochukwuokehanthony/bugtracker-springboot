package com.bugtracker.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class ProjectDto {
    private Long id;

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;
    private Long createdById;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<Long> teamMemberIds;
    private Integer ticketCount;
}