import { ApiRoutes } from "../utils/APIRoutes";
import axios from "axios";

interface Skill {
  skill_id: number;
  title: string;
}

export const getAllCoaches = async (location: string, skills: Skill[]) => {
  try {
    console.log("Fetching coaches with location:", location);
    console.log("Fetching coaches with skills:", skills);

    // Create request body
    const requestBody = {
      location: location || "",
      skills: skills || []
    };

    console.log("Fetching coaches with request body:", requestBody);
    
    // Use POST to send the filter criteria in the request body
    const response = await axios.post(`${ApiRoutes.COACHES}/sort`, requestBody);
    
    console.log("Response status:", response.status);
    console.log("Fetched coaches:", response.data);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching coaches:", error);
    throw new Error("Failed to fetch coaches");
  }
};
