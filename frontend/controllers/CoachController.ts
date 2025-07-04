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

export const getCoachByFirebaseId = async (firebaseId: string) => {
  try {
    console.log("Fetching coach with firebase ID:", firebaseId);
    const response = await axios.get(`${ApiRoutes.COACHES}/${firebaseId}`);
    console.log("Fetched coach:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching coach:", error);
    throw new Error("Failed to fetch coach");
  }
}

export const getCoachesMembers = async (id: number) => {
  try {
    const url = `${ApiRoutes.COACHES}/${id}/members`;
    console.log("Fetching members for coach with ID:", id);
    const response = await fetch(url);
    console.log("Response status:", response.status);
    if (!response.ok) {
      console.log("Response not OK. Status:", response.status);
      throw new Error("Failed to fetch members");
    }
    const data = await response.json();
    console.log("Fetched members:", data);
    return data;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members");
  }
};

