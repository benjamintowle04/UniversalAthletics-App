import { ApiRoutes } from "../utils/APIRoutes";
import axios from "axios";

interface SessionEntity {
  id?: number; 
  requestId: number; 
  sessionDate: string; 
  sessionTime: string; 
  sessionLocation: string; 
  sessionDescription: string; 
  coachFirebaseId?: string; 
  coachFirstName?: string;
  coachLastName?: string;
  coachProfilePic?: string; 
  coachId: number; 
  memberFirstName?: string; 
  memberLastName?: string; 
  memberProfilePic?: string; 
  memberFirebaseId?: string;
  memberId: number; 
  createdAt?: string; //  (auto-generated)
  updatedAt?: string; //(auto-generated)
}

/**
 * Creates a new session in the system.
 * @param session The session information to be saved
 * @returns Promise<SessionEntity> The created session
 */
export const createSession = async (session: SessionEntity) => {
  try {
    console.log("Creating session with data:", session);
    
    const response = await axios.post(`${ApiRoutes.SESSIONS}`, session);
    
    console.log("Response status:", response.status);
    console.log("Created session:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating session:", error);
    throw new Error("Failed to create session");
  }
};

/**
 * Retrieves all sessions from the system.
 * @returns Promise<SessionEntity[]> List of all sessions
 */
export const getAllSessions = async () => {
  try {
    console.log("Fetching all sessions");
    
    const response = await axios.get(`${ApiRoutes.SESSIONS}`);
    
    console.log("Response status:", response.status);
    console.log("Fetched sessions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching all sessions:", error);
    throw new Error("Failed to fetch sessions");
  }
};

/**
 * Retrieves sessions by coach ID.
 * @param coachId The ID of the coach
 * @returns Promise<SessionEntity[]> List of sessions for the coach
 */
export const getSessionsByCoachId = async (coachId: number) => {
  try {
    console.log("Fetching sessions for coach ID:", coachId);
    
    const response = await axios.get(`${ApiRoutes.SESSIONS}/coach/${coachId}`);
    
    console.log("Response status:", response.status);
    console.log("Fetched coach sessions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions for coach:", error);
    throw new Error("Failed to fetch coach sessions");
  }
};

/**
 * Retrieves sessions by member ID.
 * @param memberId The ID of the member
 * @returns Promise<SessionEntity[]> List of sessions for the member
 */
export const getSessionsByMemberId = async (memberId: number) => {
  try {
    console.log("Fetching sessions for member ID:", memberId);
    
    const response = await axios.get(`${ApiRoutes.SESSIONS}/member/${memberId}`);
    
    console.log("Response status:", response.status);
    console.log("Fetched member sessions:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions for member:", error);
    throw new Error("Failed to fetch member sessions");
  }
};

/**
 * Updates an existing session.
 * @param sessionId The ID of the session to update
 * @param session The updated session information
 * @returns Promise<SessionEntity> The updated session
 */
export const updateSession = async (sessionId: number, session: SessionEntity) => {
  try {
    console.log("Updating session with ID:", sessionId);
    console.log("Update data:", session);
    
    const response = await axios.put(`${ApiRoutes.SESSIONS}/${sessionId}`, session);
    
    console.log("Response status:", response.status);
    console.log("Updated session:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating session:", error);
    throw new Error("Failed to update session");
  }
};

/**
 * Deletes a session by ID.
 * @param sessionId The ID of the session to delete
 * @returns Promise<void>
 */
export const deleteSession = async (sessionId: number) => {
  try {
    console.log("Deleting session with ID:", sessionId);
    
    const response = await axios.delete(`${ApiRoutes.SESSIONS}/${sessionId}`);
    
    console.log("Response status:", response.status);
    console.log("Session deleted successfully");
    return response.data;
  } catch (error) {
    console.error("Error deleting session:", error);
    throw new Error("Failed to delete session");
  }
};
