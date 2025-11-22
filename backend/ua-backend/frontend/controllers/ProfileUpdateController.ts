import { ApiRoutes } from '../utils/APIRoutes';
import { Platform } from 'react-native';
import { getFirebaseAuthSafe } from '../firebase_config';
import { getUnsignedUrl } from '../utils/UnsignUrls';

export interface MemberUpdateData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  biography?: string;
  location?: string;
  skills?: { skill_id: number; title: string }[];
  firebaseId: string;
  profilePic?: string;
}

export interface CoachUpdateData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  biography1?: string;
  biography2?: string;
  location?: string;
  skillsWithLevels?: Array<{
    skillId: number;
    skillTitle: string;
    skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  }>;
  firebaseId: string;
  profilePic?: string;
  bioPic1?: string;
  bioPic2?: string;
}

// Helper to process image URI for FormData (web and mobile)
const appendProfilePicToFormData = async (
  formData: FormData,
  profilePicUri: string | null,
  firebaseId: string
) => {
  if (!profilePicUri || profilePicUri.trim() === '') {
    return;
  }

  const filename = `${firebaseId}.jpg`;

  if (Platform.OS === 'web') {
    try {
      let file: File | null = null;

      if (profilePicUri.startsWith('blob:') || profilePicUri.startsWith('data:') || profilePicUri.startsWith('http')) {
        const response = await fetch(profilePicUri);
        const blob = await response.blob();
        file = new File([blob], filename, {
          type: blob.type || 'image/jpeg',
          lastModified: Date.now(),
        });
      } else {
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
    const fileObject = {
      uri: profilePicUri,
      type: 'image/jpeg',
      name: filename,
    };
    formData.append('profilePic', fileObject as any);
    console.log('Mobile: Added file to FormData', {
      name: filename,
      type: 'image/jpeg',
      uri: profilePicUri
    });
  }
};

// Unified member update function (profile + skills)
export const updateMemberProfile = async (
  memberData: MemberUpdateData,
  profilePicUri?: string | null
) => {
  try {
    console.log('Starting member profile update with data:', memberData);
    console.log('Profile picture URI:', profilePicUri);

    const formData = new FormData();

    // Add member info as JSON string
    const memberInfoJson = {
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      email: memberData.email,
      phone: memberData.phone,
      biography: memberData.biography || '',
      location: memberData.location || '',
  firebaseID: getFirebaseAuthSafe()?.currentUser?.uid || memberData.firebaseId,
    };
    formData.append('memberInfoJson', JSON.stringify(memberInfoJson));

    // Handle skills (always present, can be empty array)
    formData.append('skillsJson', JSON.stringify(memberData.skills || []));

    // Handle profile picture for both platforms
    await appendProfilePicToFormData(formData, profilePicUri || memberData.profilePic || null, memberData.firebaseId);

    const memberUrl = `${ApiRoutes.MEMBERS}/update/${memberData.firebaseId}`;
    console.log('Making PUT request to:', memberUrl);

    const response = await fetch(memberUrl, {
      method: 'PUT',
      body: formData,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Member profile update successful:', result);
    return result;

  } catch (error) {
    console.error('Error updating member profile:', error);
    throw error;
  }
};

// Unified coach update function (profile + skills)
export const updateCoachProfile = async (
  coachData: CoachUpdateData,
  profilePicUri?: string | null
) => {
  try {
    console.log('Starting coach profile update with data:', coachData);
    console.log('Profile picture URI:', profilePicUri);

    const formData = new FormData();

    // Add coach info as JSON string
    const coachInfoJson = {
      firstName: coachData.firstName,
      lastName: coachData.lastName,
      email: coachData.email,
      phone: coachData.phone,
      biography1: coachData.biography1 || '',
      biography2: coachData.biography2 || '',
      location: coachData.location || '',
  firebaseID: getFirebaseAuthSafe()?.currentUser?.uid || coachData.firebaseId,
    };
    formData.append('coachInfoJson', JSON.stringify(coachInfoJson));

    // Handle skillsWithLevels (always present, can be empty array)
    formData.append('skillsJson', JSON.stringify(coachData.skillsWithLevels || []));

    // Handle profile picture for both platforms
    await appendProfilePicToFormData(formData, profilePicUri || coachData.profilePic || null, coachData.firebaseId);

    // Optionally handle bioPic1 and bioPic2 if needed (add similar logic if required)

    const coachUrl = `${ApiRoutes.COACHES}/update/${coachData.firebaseId}`;
    console.log('Making PUT request to:', coachUrl);

    const response = await fetch(coachUrl, {
      method: 'PUT',
      body: formData,
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Coach profile update successful:', result);
    return result;

  } catch (error) {
    console.error('Error updating coach profile:', error);
    throw error;
  }
};

// Update member skills only (uses same structure as profile update)
export const updateMemberSkillsWithFormData = async (
  skills: { skill_id: number; title: string }[],
  userData: any
) => {
  const firebaseId = userData?.firebaseId || getFirebaseAuthSafe()?.currentUser?.uid;
  if (!firebaseId) {
    throw new Error('Firebase ID is required but not available');
  }

  // Use the same request structure as updateMemberProfile
  const memberUpdateData: MemberUpdateData = {
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    email: userData?.email,
    phone: userData?.phone,
    biography: userData?.biography || '',
    location: userData?.location || '',
    firebaseId: firebaseId,
    skills: skills,
    profilePic: userData?.profilePic || '',
  };

  return await updateMemberProfile(memberUpdateData, userData?.profilePic || null);
};

// Update coach skills only (uses same structure as profile update)
export const updateCoachSkillsWithFormData = async (
  skillsWithLevels: Array<{
    skillId: number;
    skillTitle: string;
    skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  }>,
  userData: any
) => {
  const firebaseId = userData?.firebaseId || getFirebaseAuthSafe()?.currentUser?.uid;
  if (!firebaseId) {
    throw new Error('Firebase ID is required but not available');
  }

  // Use the same request structure as updateCoachProfile
  const coachUpdateData: CoachUpdateData = {
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    email: userData?.email,
    phone: userData?.phone,
    biography1: userData?.biography1 || '',
    biography2: userData?.biography2 || '',
    location: userData?.location || '',
    firebaseId: firebaseId,
    skillsWithLevels: skillsWithLevels,
    profilePic: userData?.profilePic || '',
    bioPic1: userData?.bioPic1 || '',
    bioPic2: userData?.bioPic2 || '',
  };

  return await updateCoachProfile(coachUpdateData, userData?.profilePic || null);
};