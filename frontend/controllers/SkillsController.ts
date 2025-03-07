import axios from "axios";
import {ApiRoutes} from "../utils/APIRoutes";

export const fetchSkills = async () => {
  try {
    const url = ApiRoutes.GET_SKILLS_ALL; 
    console.log("URL: ", url);

    const response = await axios.get(url).then(response => {  
      if (!response) {
        throw new Error("Failed to fetch data");
        return null;
      }

      else {
        console.log(response.data);
        return response.data;
      }
      
    }).catch(error => {
        console.log(error);
    });

    return response.data;
    
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
