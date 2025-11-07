package com.bugtracker.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class TicketDto {
    private Long id;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private String projectName;
    private Long createdById;
    private String createdByName;
    private String priority;
    private String status;
    private String type;
    private Integer timeEstimate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<Long> assignedDeveloperIds;
    private Integer commentCount;
}