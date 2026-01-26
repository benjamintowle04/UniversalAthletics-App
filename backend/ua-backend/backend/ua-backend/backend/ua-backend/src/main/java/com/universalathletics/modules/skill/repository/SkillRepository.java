package com.universalathletics.modules.skill.repository;

//------------------------------- imports ------------------------------------//
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.universalathletics.modules.skill.entity.SkillEntity;

//--------------------- Skill Repository Interface -------------------------//
/**
 * Repository interface for managing SkillEntity persistence operations.
 * Extends JpaRepository to provide standard CRUD operations and additional
 * query methods for skill management.
 *
 * This repository handles all database interactions for athletic skills,
 * including creating, reading, updating, and deleting skill records.
 */
@Repository
public interface SkillRepository extends JpaRepository<SkillEntity, Integer> {
          // Inherits standard CRUD operations from JpaRepository
          // Additional custom query methods can be added here as needed
}