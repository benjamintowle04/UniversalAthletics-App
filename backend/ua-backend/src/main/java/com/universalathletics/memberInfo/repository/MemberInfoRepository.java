package com.universalathletics.memberInfo.repository;

import java.lang.reflect.Member;
import java.util.Optional;

//------------------------------- imports ------------------------------------//
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.universalathletics.memberInfo.entity.MemberInfoEntity;

//--------------------- MemberInfo Repository Interface ---------------------//
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
