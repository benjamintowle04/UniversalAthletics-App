import { ApiRoutes } from "../utils/APIRoutes";
import axios from "axios";

export const getMembersIncomingPendingConnectionRequests = async (memberId: number) => {
  try {
    console.log("Fetching connection requests for member with status 'PENDING'");
    const response = await axios.get(`${ApiRoutes.PENDING_CONNECTION_REQUESTS}/member/${memberId}`);
    
    console.log("Response status:", response.status);
    console.log("Fetched pending requests:", response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching coaches:", error);
    throw new Error("Failed to fetch coaches");
  }
};

export const getCoachesIncomingPendingConnectionRequests = async (coachId: number) => {
  try {
    console.log("Fetching connection requests for coach with status 'PENDING'");
    const response = await axios.get(`${ApiRoutes.PENDING_CONNECTION_REQUESTS}/coach/${coachId}`);
    
    console.log("Response status:", response.status);
    console.log("Fetched pending requests:", response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching pending requests for coach:", error);
    throw new Error("Failed to fetch pending requests for coach");
  }
};

export const getMembersSentPendingConnectionRequests = async (memberId: number) => {
  try {
    console.log("Fetching connection requests sent by member with status 'PENDING'");
    const response = await axios.get(`${ApiRoutes.PENDING_CONNECTION_REQUESTS}/sent/member/${memberId}`);
    
    console.log("Response status:", response.status);
    console.log("Fetched sent pending requests:", response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching sent pending requests for member:", error);
    throw new Error("Failed to fetch sent pending requests for member");
  }
};

export const getCoachesSentPendingConnectionRequests = async (coachId: number) => {
  try {
    console.log("Fetching connection requests sent by coach with status 'PENDING'");
    const response = await axios.get(`${ApiRoutes.PENDING_CONNECTION_REQUESTS}/sent/coach/${coachId}`);
    
    console.log("Response status:", response.status);
    console.log("Fetched sent pending requests:", response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching sent pending requests for coach:", error);
    throw new Error("Failed to fetch sent pending requests for coach");
  }
};

export const createMemberToCoachConnectionRequest = async (connectionRequestData: any) => {
  try {
    console.log("Creating member-to-coach connection request:", connectionRequestData);
    const response = await axios.post(`${ApiRoutes.CONNECTION_REQUESTS}/member-to-coach`, connectionRequestData);
    
    console.log("Create response status:", response.status);
    console.log("Create response:", response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error creating member-to-coach connection request:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || "Failed to create member-to-coach connection request");
    }
    throw new Error("Failed to create member-to-coach connection request");
  }
};

export const createCoachToMemberConnectionRequest = async (connectionRequestData: any) => {
  try {
    console.log("Creating coach-to-member connection request:", connectionRequestData);
    const response = await axios.post(`${ApiRoutes.CONNECTION_REQUESTS}/coach-to-member`, connectionRequestData);
    
    console.log("Create response status:", response.status);
    console.log("Create response:", response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error creating coach-to-member connection request:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || "Failed to create coach-to-member connection request");
    }
    throw new Error("Failed to create coach-to-member connection request");
  }
};

export const acceptConnectionRequest = async (requestId: number, receiverId: number) => {
  try {
    console.log(`Accepting connection request ${requestId} for member or coach ${receiverId}`);
    const response = await axios.put(`${ApiRoutes.CONNECTION_REQUESTS}/${requestId}/accept/${receiverId}`);
    
    console.log("Accept response status:", response.status);
    console.log("Accept response:", response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error accepting connection request:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || "Failed to accept connection request");
    }
    throw new Error("Failed to accept connection request");
  }
};

export const declineConnectionRequest = async (requestId: number, receiverId: number) => {
  try {
    console.log(`Declining connection request ${requestId} for member or coach ${receiverId}`);
    const response = await axios.put(`${ApiRoutes.CONNECTION_REQUESTS}/${requestId}/decline/${receiverId}`);
    
    console.log("Decline response status:", response.status);
    console.log("Decline response:", response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error declining connection request:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || "Failed to decline connection request");
    }
    throw new Error("Failed to decline connection request");
  }
};

export const cancelConnectionRequest = async (requestId: number, senderId: number) => {
  try {
    console.log(`Cancelling connection request ${requestId} for member or coach ${senderId}`);
    const response = await axios.put(`${ApiRoutes.CONNECTION_REQUESTS}/${requestId}/cancel/${senderId}`);
    
    console.log("Cancel response status:", response.status);
    console.log("Cancel response:", response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error cancelling connection request:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data || "Failed to cancel connection request");
    }
    throw new Error("Failed to cancel connection request");
  }
};
