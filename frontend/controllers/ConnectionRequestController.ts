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

export const acceptConnectionRequest = async (requestId: number, receiverId: number) => {
  try {
    console.log(`Accepting connection request ${requestId} for member ${receiverId}`);
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
    console.log(`Declining connection request ${requestId} for member ${receiverId}`);
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
