import { ApiRoutes } from "../utils/APIRoutes";

export const getMemberByFirebaseId = async (firebaseId: string) => {
  try {
    
    // This hardcoded ID will allow you to have test data automatically populated in the home page
    // Before merging to main, be sure to reset this so that we use the actual parameter instead
    const HARDCODED_FIREBASE_ID : string = "EFogg1abZOeVRPDxcp541GNzk0o2";

    const url = `${ApiRoutes.MEMBERS}/${HARDCODED_FIREBASE_ID}`;
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

export const getAllMembers = async () => {
  try {
    const url = `${ApiRoutes.MEMBERS}`;
    console.log("Fetching all members from:", url);
    const response = await fetch(url);
    console.log("Response status:", response.status);
    if (!response.ok) {
      console.log("Response not OK. Status:", response.status);
      throw new Error("Failed to fetch members");
    }

    const data = await response.json();
    console.log("Fetched members:", data);
    return data;

  }

  catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members");
  }
};
