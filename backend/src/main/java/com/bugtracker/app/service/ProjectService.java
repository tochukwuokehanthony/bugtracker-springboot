package com.bugtracker.app.service;

import com.bugtracker.app.dto.ProjectDto;
import com.bugtracker.app.entity.Project;
import com.bugtracker.app.entity.User;
import com.bugtracker.app.exception.ResourceNotFoundException;
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
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketRepository ticketRepository;

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return convertToDto(project);
    }

    public List<ProjectDto> getProjectsByUserId(Long userId) {
        return projectRepository.findProjectsByTeamMemberId(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectDto createProject(ProjectDto projectDto, String creatorEmail) {
        User creator = userRepository.findByEmail(creatorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Project project = new Project();
        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());
        project.setCreatedBy(creator);

        project = projectRepository.save(project);

        // Add creator to team members
        project.getTeamMembers().add(creator);
        creator.getProjects().add(project);

        project = projectRepository.save(project);
        return convertToDto(project);
    }

    @Transactional
    public ProjectDto updateProject(Long id, ProjectDto projectDto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());

        project = projectRepository.save(project);
        return convertToDto(project);
    }

    @Transactional
    public void addTeamMember(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        project.getTeamMembers().add(user);
        user.getProjects().add(project);
        projectRepository.save(project);
    }

    @Transactional
    public void removeTeamMember(Long projectId, Long userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        project.getTeamMembers().remove(user);
        user.getProjects().remove(project);
        projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        projectRepository.delete(project);
    }

    private ProjectDto convertToDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        if (project.getCreatedBy() != null) {
            dto.setCreatedById(project.getCreatedBy().getId());
            dto.setCreatedByName(project.getCreatedBy().getFullName());
        }
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        Set<Long> teamMemberIds = project.getTeamMembers().stream()
                .map(User::getId)
                .collect(Collectors.toSet());
        dto.setTeamMemberIds(teamMemberIds);

        Long ticketCount = ticketRepository.countByProjectId(project.getId());
        dto.setTicketCount(ticketCount.intValue());

        return dto;
    }
}