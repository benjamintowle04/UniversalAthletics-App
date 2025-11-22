import { View, Text, ActivityIndicator, Platform, Dimensions, Alert } from 'react-native'
import React, { useState, useCallback } from 'react'
import { getFirebaseAuthSafe } from '../../../firebase_config';
import { RouterProps } from '../../types/RouterProps';
import { useUser } from '../../contexts/UserContext';
import { signOut } from 'firebase/auth';
import UserSettingsWebUI from '../../ui/web/settings/UserSettingsWebUI';
import UserSettingsMobileUI from '../../ui/mobile/settings/UserSettingsMobileUI';
import '../../../global.css';


const UserSettings = ({ navigation }: RouterProps) => {    
  // resolve auth at runtime
  const auth = getFirebaseAuthSafe();
  const { userData, setUserData, isLoading, userType, isDetectingUserType } = useUser();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Platform detection
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  // Logout function
  const handleLogout = useCallback(async () => {
    if (isWeb) {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (!confirmed) return;
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: performLogout }
        ]
      );
      return;
    }
    
    performLogout();
  }, [isWeb]);

  const performLogout = async () => {
    try {
      setIsLoggingOut(true);
      const runtimeAuth = getFirebaseAuthSafe();
      if (!runtimeAuth) {
        setUserData(null);
        console.warn('performLogout: auth not available; cleared local user data');
        setIsLoggingOut(false);
        return;
      }
      await signOut(runtimeAuth);
      setUserData(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      if (isWeb) {
        alert('Failed to logout. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to logout. Please try again.');
      }
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Memoize image handlers
  const handleImageLoadStart = useCallback(() => {
    console.log("Image loading started for URL:", userData?.profilePic);
    setImageLoading(true);
  }, [userData?.profilePic]);

  const handleImageLoadEnd = useCallback(() => {
    console.log("Image loading completed for URL:", userData?.profilePic);
    setImageLoading(false);
  }, [userData?.profilePic]);

  const handleImageError = useCallback((e: any) => {
    console.error("Image loading error for URL:", userData?.profilePic);
    console.error("Error details:", e.nativeEvent?.error || e);
    setImageError(true);
    setImageLoading(false);
    if (!isWeb) {
      Alert.alert("Error", "Failed to load profile image");
    }
  }, [userData?.profilePic, isWeb]);

  // Test image URL function
  const testImageUrl = useCallback(async () => {
    if (userData?.profilePic) {
      try {
        console.log("Testing image URL:", userData.profilePic);
        const response = await fetch(userData.profilePic, { method: 'HEAD' });
        console.log("URL test response status:", response.status);
        
        if (response.ok) {
          console.log("✅ URL is accessible");
        } else {
          console.log("❌ URL returned error:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("❌ URL test failed:", error);
      }
    }
  }, [userData?.profilePic]);

  // Get user-specific data based on user type
  const getUserSpecificData = () => {
    if (!userData) return null;

    if (userData.userType === 'COACH') {
      const bio1 = userData.biography1 ? userData.biography1.trim() : ''
      const bio2 = userData.biography2 ? userData.biography2.trim() : ''
      const combinedBio = bio1 && bio2 ? `${bio1}\n\n${bio2}` : (bio1 || bio2)

      return {
        biography: combinedBio || 'No biography available',
        connectionsLabel: 'Members',
        connectionsCount: userData.connections?.length || 0,
        requestsLabel: 'Connection Requests from Members',
        sessionRequestsLabel: 'Session Requests from Members'
      };
    } else {
      return {
        biography: userData.biography || 'No biography available',
        connectionsLabel: 'Coaches',
        connectionsCount: userData.connections?.length || 0,
        requestsLabel: 'Connection Requests from Coaches',
        sessionRequestsLabel: 'Session Requests from Coaches'
      };
    }
  };

  const userSpecificData = getUserSpecificData();

  // Show loading state while user data is being fetched or user type is being detected
  if (isLoading || isDetectingUserType || !userData || !userSpecificData) {
    return (
      <View className={`flex-1 justify-center items-center ${isWeb ? 'min-h-screen bg-gray-100' : ''}`}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">
          {isDetectingUserType ? 'Detecting user type...' : 'Loading user data...'}
        </Text>
        {userType && (
          <Text className="mt-1 text-gray-500 text-sm">
            User type: {userType}
          </Text>
        )}
      </View>
    );
  }

  // Handle profile update callback
  const handleProfileUpdate = (updatedData: any) => {
    setUserData(updatedData);
  };

  // Prepare props for UI components
  const uiProps = {
    userData,
    userSpecificData,
    imageLoading,
    imageError,
    isLoggingOut,
    isWeb,
    handleLogout,
    handleImageLoadStart,
    handleImageLoadEnd,
    handleImageError,
    testImageUrl,
    setImageLoading,
    setImageError,
    onProfileUpdate: handleProfileUpdate,
    navigation
  };

  // Render appropriate UI based on platform and screen size
  if (isWeb && isLargeScreen) {
    return <UserSettingsWebUI {...uiProps} />;
  }

  // Mobile/Tablet Layout
  return <UserSettingsMobileUI {...uiProps} />;
}

export default UserSettings;
