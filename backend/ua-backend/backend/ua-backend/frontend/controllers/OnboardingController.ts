import { ApiRoutes } from '../utils/APIRoutes';
import { Platform } from 'react-native';
import { getFirebaseAuthSafe } from '../firebase_config';

export interface UserOnboardingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  biography?: string;
  location?: string | null;
  skills?: { skill_id: number, title: string }[];
  firebaseId: string;
}

export const postUserOnboarding = async (userData: UserOnboardingData, profilePicUri: string | null) => {
  try {
    console.log('Starting onboarding request with data:', userData);
    console.log('Profile picture URI:', profilePicUri);
    console.log('Platform:', Platform.OS);

    const formData = new FormData();
    
    // Add user data as JSON string (matching backend expectation)
    const memberInfoJson = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      biography: userData.biography || '',
      location: userData.location || '',
  firebaseID: getFirebaseAuthSafe()?.currentUser?.uid || userData.firebaseId,
    };

    formData.append('memberInfoJson', JSON.stringify(memberInfoJson));

    // Handle skills separately (matching backend expectation)
    if (userData.skills && userData.skills.length > 0) {
      const skillsJson = JSON.stringify(userData.skills);
      formData.append('skillsJson', skillsJson);
    } else {
      formData.append('skillsJson', JSON.stringify([]));
    }

    // Handle profile picture for both platforms
    if (profilePicUri && profilePicUri.trim() !== '') {
      console.log('Processing profile picture for platform:', Platform.OS);
      console.log('Profile picture URI type:', typeof profilePicUri);
      console.log('Profile picture URI value:', profilePicUri);

      // Get Firebase ID for filename
  const firebaseId = getFirebaseAuthSafe()?.currentUser?.uid || userData.firebaseId;
      const filename = `${firebaseId}.jpg`;

      if (Platform.OS === 'web') {
        console.log('Web platform - processing image...');
        
        try {
          let file: File | null = null;

          if (profilePicUri.startsWith('blob:')) {
            console.log('Processing blob URL...');
            const response = await fetch(profilePicUri);
            const blob = await response.blob();
            console.log('Blob details:', { type: blob.type, size: blob.size });
            
            file = new File([blob], filename, {
              type: blob.type || 'image/jpeg',
              lastModified: Date.now(),
            });
          } else if (profilePicUri.startsWith('data:')) {
            console.log('Processing data URL...');
            const response = await fetch(profilePicUri);
            const blob = await response.blob();
            console.log('Data URL blob details:', { type: blob.type, size: blob.size });
            
            file = new File([blob], filename, {
              type: blob.type || 'image/jpeg',
              lastModified: Date.now(),
            });
          } else if (profilePicUri.startsWith('http')) {
            console.log('Processing HTTP URL...');
            const response = await fetch(profilePicUri);
            const blob = await response.blob();
            console.log('HTTP URL blob details:', { type: blob.type, size: blob.size });
            
            file = new File([blob], filename, {
              type: blob.type || 'image/jpeg',
              lastModified: Date.now(),
            });
          } else {
            console.log('Unknown URI format, attempting to process as blob...');
            try {
              const response = await fetch(profilePicUri);
              const blob = await response.blob();
              file = new File([blob], filename, {
                type: blob.type || 'image/jpeg',
                lastModified: Date.now(),
              });
            } catch (fetchError) {
              console.error('Failed to fetch URI as blob:', fetchError);
            }
          }

          if (file) {
            formData.append('profilePic', file);
            console.log('Web: Successfully added File object to FormData', {
              name: file.name,
              type: file.type,
              size: file.size
            });
          } else {
            console.error('Web: Failed to create File object from URI');
          }
        } catch (error) {
          console.error('Error processing web image:', error);
        }
      } else {
        console.log('Mobile platform - processing file URI...');
        // Mobile platform - handle file URIs with Firebase ID filename
        const fileObject = {
          uri: profilePicUri,
          type: 'image/jpeg', // Force to JPEG
          name: filename, // Use Firebase ID as filename
        };

        formData.append('profilePic', fileObject as any);
        console.log('Mobile: Added file to FormData', {
          name: filename,
          type: 'image/jpeg',
          uri: profilePicUri
        });
      }
    } else {
      console.log('No profile picture provided or empty URI');
    }

    console.log('Making request to:', ApiRoutes.POST_USER_ONBOARDING);


    const response = await fetch(ApiRoutes.POST_USER_ONBOARDING, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - let the platform handle it
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Onboarding successful:', result);
    return result;

  } catch (error) {
    console.error('Error in postUserOnboarding:', error);
    throw error;
  }
};
