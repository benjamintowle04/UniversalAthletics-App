import { ApiRoutes } from "../utils/APIRoutes";

export const fetchSkills = async () => {
  try {
    const url = ApiRoutes.GET_SKILLS_ALL;
    console.log("URL: ", url);

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};