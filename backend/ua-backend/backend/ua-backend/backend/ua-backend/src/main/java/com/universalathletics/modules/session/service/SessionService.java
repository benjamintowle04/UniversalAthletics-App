package com.universalathletics.modules.session.service;

//------------------------------- imports ------------------------------------//
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.universalathletics.modules.session.entity.SessionEntity;
import com.universalathletics.modules.session.repository.SessionRepository;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.EntityNotFoundException;

//--------------------- Session Service Class -----------------------------//
/**
 * SessionService handles all business logic related to session operations in
 * the
 * Universal Athletics application.
 * This service layer acts as an intermediary between the controller and
 * repository layers.
 * 
 * Responsibilities:
 * - Session creation and management
 * - Session data validation
 * - Session information processing
 */
@Service
public class SessionService {

    /**
     * Autowired instance of SessionRepository for database operations.
     * Following Spring best practices for dependency injection.
     */
    @Autowired
    private SessionRepository sessionRepository;

    // -------------------------------- Create Session ----------------------------//
    /**
     * Creates or updates a session in the database.(POST)
     * 
     * @param session The SessionEntity object containing session information
     * @return SessionEntity The saved session object with generated ID
     * @throws IllegalArgumentException if session is null
     */
    public SessionEntity saveSession(SessionEntity session) {
        if (session == null) {
            throw new IllegalArgumentException("Session information cannot be null");
        }

        return sessionRepository.save(session);
    }

    // -------------------------------- Get Session By ID -------------------------//
    /**
     * Retrieves a session by their ID.(GET)
     *
     * @param id The ID of the session to find
     * @return SessionEntity if found
     * @throws EntityNotFoundException if session not found
     */
    public SessionEntity findSessionById(Integer id) {
        return sessionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Session not found with id: " + id));
    }

    // --------------------------------- Get All Sessions
    // --------------------------//
    /**
     * Retrieves all sessions from the database.(GET)
     *
     * @return List<SessionEntity> containing all sessions
     */
    public List<SessionEntity> findAllSessions() {
        return sessionRepository.findAll();
    }

    // --------------------------------- Delete Session
    // ----------------------------//
    /**
     * Deletes a session from the database.(DELETE)
     * 
     * @param id The ID of the session to delete
     * @return boolean indicating success or failure
     * @throws EntityNotFoundException if session not found
     */
    public boolean deleteSession(Integer id) {
        if (!sessionRepository.existsById(id)) {
            throw new EntityNotFoundException("Session not found with id: " + id);
        }
        sessionRepository.deleteById(id);
        return true;
    }

    // -----------------------Get Sessions By Coach  ID---------------------//
    /**
     * Retrieves sessions by coach  ID.(GET)
     *
     * @param coachId The ID of the coach to find sessions for
     * @return List<SessionEntity> containing sessions for the coach
     */
    public List<SessionEntity> findSessionsByCoachId(Integer coachId) {
        return sessionRepository.findByCoachId(coachId);
    }

    // -----------------------Get Sessions By Member  ID---------------------//
    /**
     * Retrieves sessions by member  ID.(GET)
     *
     * @param memberId The ID of the member to find sessions for
     * @return List<SessionEntity> containing sessions for the member
     */
    public List<SessionEntity> findSessionsByMemberId(Integer memberId) {
        return sessionRepository.findByMemberId(memberId);
    }

    // -----------------------Get Sessions By Request ID---------------------//
    /**
     * Retrieves sessions by request ID.(GET)
     *
     * @param requestId The request ID to find sessions for
     * @return List<SessionEntity> containing sessions for the request
     */
    public List<SessionEntity> findSessionsByRequestId(Integer requestId) {
        return sessionRepository.findByRequestId(requestId);
    }

    // -------------------------------- Update Session ----------------------------//
    /**
     * Updates an existing session in the database.(PUT)
     * 
     * @param session The SessionEntity object containing updated session information
     * @return SessionEntity The updated session object, or null if not found
     */
    public SessionEntity updateSession(SessionEntity session) {
        if (session == null || session.getId() == null) {
            throw new IllegalArgumentException("Session and session ID cannot be null");
        }

        Optional<SessionEntity> existingSession = sessionRepository.findById(session.getId());
        if (existingSession.isPresent()) {
            return sessionRepository.save(session);
        } else {
            throw new EntityNotFoundException("Session not found with id: " + session.getId());
        }
    }
}
