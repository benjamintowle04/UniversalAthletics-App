package com.universalathletics.modules.session.repository;

//------------------------------- imports ------------------------------------//
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.universalathletics.modules.session.entity.SessionEntity;

import java.util.List;
import java.util.Optional;

//--------------------- Session Repository Interface -------------------------//
/**
 * Repository interface for SessionEntity operations.
 * Extends JpaRepository to provide basic CRUD operations and custom query methods.
 * 
 * This interface handles all database interactions for session-related operations
 * in the Universal Athletics application.
 * 
 * Responsibilities:
 * - Provide standard CRUD operations through JpaRepository
 * - Define custom query methods for specific session retrieval needs
 * - Handle database transactions for session operations
 */

@Repository
public interface SessionRepository extends JpaRepository<SessionEntity, Integer> {

    /**
     * Finds sessions by coach  ID.
     * 
     * @param coachId The  ID of the coach
     * @return List<SessionEntity> containing all sessions for the specified coach
     */
    @Query("SELECT s FROM SessionEntity s WHERE s.coachId = :coachId")
    List<SessionEntity> findByCoachId(@Param("coachId") Integer coachId);

    /**
     * Finds sessions by member  ID.
     * 
     * @param memberId The  ID of the member
     * @return List<SessionEntity> containing all sessions for the specified member
     */
    @Query("SELECT s FROM SessionEntity s WHERE s.memberId = :memberId")
    List<SessionEntity> findByMemberId(@Param("memberId") Integer memberId);

    /**
     * Finds sessions by request ID.
     * 
     * @param requestId The ID of the session request
     * @return List<SessionEntity> containing all sessions for the specified request
     */
    @Query("SELECT s FROM SessionEntity s WHERE s.requestId = :requestId")
    List<SessionEntity> findByRequestId(@Param("requestId") Integer requestId);

    /**
     * Finds sessions by session ID.
     * This method is already provided by JpaRepository but explicitly defined for clarity.
     * 
     * @param sessionId The ID of the session
     * @return Optional<SessionEntity> containing the session if found
     */
    Optional<SessionEntity> findById(Integer sessionId);

    /**
     * Finds sessions by coach  ID and member  ID.
     * Useful for finding sessions between a specific coach and member.
     * 
     * @param coachId The  ID of the coach
     * @param memberId The  ID of the member
     * @return List<SessionEntity> containing sessions between the specified coach and member
     */
    @Query("SELECT s FROM SessionEntity s WHERE s.coachId = :coachId AND s.memberId = :memberId")
    List<SessionEntity> findByCoachIdAndMemberId(
        @Param("coachId") Integer coachId, 
        @Param("memberId") Integer memberId
    );

    /**
     * Finds sessions by location (case-insensitive partial match).
     * 
     * @param location The location to search for
     * @return List<SessionEntity> containing sessions at locations matching the search term
     */
    @Query("SELECT s FROM SessionEntity s WHERE LOWER(s.sessionLocation) LIKE LOWER(CONCAT('%', :location, '%'))")
    List<SessionEntity> findBySessionLocationContainingIgnoreCase(@Param("location") String location);

    /**
     * Counts the number of sessions for a specific coach.
     * 
     * @param coachId The  ID of the coach
     * @return Long representing the count of sessions for the coach
     */
    @Query("SELECT COUNT(s) FROM SessionEntity s WHERE s.coachId = :coachId")
    Long countByCoachId(@Param("coachId") Integer coachId);

    /**
     * Counts the number of sessions for a specific member.
     * 
     * @param memberId The  ID of the member
     * @return Long representing the count of sessions for the member
     */
    @Query("SELECT COUNT(s) FROM SessionEntity s WHERE s.memberId = :memberId")
    Long countByMemberId(@Param("memberId") Integer memberId);
}
