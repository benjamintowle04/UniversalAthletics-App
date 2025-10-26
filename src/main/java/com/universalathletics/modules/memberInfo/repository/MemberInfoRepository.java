package com.universalathletics.modules.memberInfo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.universalathletics.modules.memberInfo.entity.MemberInfoEntity;

/**
 * Repository interface for managing MemberInfoEntity persistence operations.
 * Extends JpaRepository to provide standard CRUD operations and additional
 * query methods for member information management.
 *
 * This repository handles all database interactions for member information,
 * including creating, reading, updating, and deleting member records.
 */
@Repository
public interface MemberInfoRepository extends JpaRepository<MemberInfoEntity, Integer> {
    // Inherits standard CRUD operations from JpaRepository
    // Additional custom query methods can be added here as needed

    /**
     * Find a member by their firebaseID
     */
    Optional<MemberInfoEntity> findByFirebaseID(String firebaseID);
}
