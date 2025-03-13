import { ApiRoutes } from "../utils/APIRoutes";

export const postUserOnboarding = async (userData: any, imageUri: string | null) => {
 
  try {
    const url = ApiRoutes.POST_USER_ONBOARDING;
    console.log("Starting onboarding request to:", url);
    
    const formData = new FormData();
    
    // Destructure userData and separate skills
    const { skills, ...memberInfo } = userData;
    console.log("Member Info being sent:", memberInfo);
    console.log("Skills being sent:", skills);
    
    // Add member info as JSON string (without skills)
    formData.append('memberInfoJson', JSON.stringify(memberInfo));
    
    // Add skills as separate JSON
    formData.append('skillsJson', JSON.stringify(skills));
    
    // Add profile picture if exists
    if (imageUri) {
      const fileExtension = imageUri.split('.').pop();
      console.log("Adding profile picture with extension:", fileExtension);
      formData.append('profilePic', {
        uri: imageUri,
        type: `image/${fileExtension}`,
        name: `profile-picture-${userData.firebaseID}.${fileExtension}`,
      } as any);
    }

    console.log("FormData prepared, sending request...");

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    console.log("Response status:", response.status);
    
    if (!response.ok) {
      console.log("Response not OK. Status:", response.status);
      throw new Error("Failed to post data");
    }
    
    const data = await response.json();
    console.log("Successful response data:", data);
    return data;
    
  } catch (error) {
    console.error("Detailed error in postUserOnboarding:", error);
    throw new Error("Failed to post data");
  }
};
