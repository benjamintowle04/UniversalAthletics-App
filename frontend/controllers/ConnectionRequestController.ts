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