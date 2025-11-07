package com.bugtracker.app.repository;

import com.bugtracker.app.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByCreatedById(Long userId);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN FETCH p.teamMembers WHERE p.id = :id")
    Project findByIdWithTeam(Long id);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.teamMembers u WHERE u.id = :userId")
    List<Project> findProjectsByTeamMemberId(Long userId);
}