import { useState, useEffect } from 'react';
import { getCoachByFirebaseId } from '../../../controllers/CoachController';
import { getMemberByFirebaseId } from '../../../controllers/MemberInfoController';

interface ProfileData {
  firebaseID?: string;
  id?: string;
  firstName: string;
  lastName: string;
  location: string;
  email?: string;
  phone?: string;
  profilePic?: string;
  biography1?: string;
  biography2?: string;
  biography?: string;
  bioPic1?: string;
  bioPic2?: string;
  skills: Array<{ skill_id: number; title: string }>;
  // Add new field for coaches with skill levels
  skillsWithLevels?: Array<{
    skillId: number;
    skillTitle: string;
    skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  }>;
  userType: 'COACH' | 'MEMBER';
}

interface UseProfileDataProps {
  profileId?: string;
  profileType?: 'COACH' | 'MEMBER';
  profileFirebaseId?: string;
}

export const useProfileData = ({
  profileId,
  profileType,
  profileFirebaseId,
}: UseProfileDataProps) => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      // Validate required parameters
      if (!profileId || !profileType || !profileFirebaseId) {
        setError('Missing profile information. Please try navigating here again.');
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);
        let fetchedData;
        console.log('Fetching profile data with firebase id of ', profileFirebaseId);

        if (profileType === 'COACH') {
          fetchedData = await getCoachByFirebaseId(profileFirebaseId);
          if (fetchedData) {
            fetchedData.userType = 'COACH';

            // Handle backward compatibility for skills
            // If skillsWithLevels exists, use it; otherwise, use the old skills format
            if (fetchedData.skillsWithLevels && fetchedData.skillsWithLevels.length > 0) {
              // New format with skill levels - keep both for compatibility
              console.log('Coach has skills with levels:', fetchedData.skillsWithLevels);
            } else if (fetchedData.skills) {
              // Old format - convert to new format for consistency
              console.log('Coach has traditional skills:', fetchedData.skills);
              // Keep the old skills format as is for backward compatibility
            }
          }
        } else {
          fetchedData = await getMemberByFirebaseId(profileFirebaseId);
          if (fetchedData) {
            fetchedData.userType = 'MEMBER';
          }
        }

        if (!fetchedData) {
          setError(`${profileType.toLowerCase()} profile not found.`);
          return;
        }

        setProfileData(fetchedData);
      } catch (error) {
        console.error(`Error fetching ${profileType?.toLowerCase()} data:`, error);
        setError(`Failed to load ${profileType?.toLowerCase()} profile. Please try again.`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId, profileType, profileFirebaseId]);

  return {
    profileData,
    error,
    isLoading,
    refetch: () => {
      if (profileId && profileType && profileFirebaseId) {
        setIsLoading(true);
        setError(null);
        // The useEffect will handle the refetch
      }
    },
  };
};