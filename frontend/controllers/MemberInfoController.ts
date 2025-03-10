import { ApiRoutes } from "../utils/APIRoutes";

export const getMemberByFirebaseId = async (firebaseId: string) => {
  try {
    const url = `${ApiRoutes.MEMBERS}/${firebaseId}`;
    console.log("Fetching member data from:", url);

    const response = await fetch(url);
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      console.log("Response not OK. Status:", response.status);
      throw new Error("Failed to fetch member data");
    }
    
    const data = await response.json();
    console.log("Fetched member data:", data);
    return data;
    
  } catch (error) {
    console.error("Error fetching member:", error);
    throw new Error("Failed to fetch member data");
  }
};
