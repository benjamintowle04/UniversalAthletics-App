import { View, Text, ActivityIndicator, Platform, Dimensions, Alert } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { getFirebaseAuthSafe } from '../../../firebase_config';
import { RouterProps } from '../../types/RouterProps';
import { useUser } from '../../contexts/UserContext';
import { signOut } from 'firebase/auth';
import HomeWebUI from '../../ui/web/home/HomeWebUI';
import HomeMobileUI from '../../ui/mobile/home/HomeMobileUI';
import '../../../global.css';


const Home = ({ navigation }: RouterProps) => {    
  const auth = getFirebaseAuthSafe();
  const { userData, setUserData, isLoading, userType, isDetectingUserType, isGuest } = useUser();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Platform detection
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  useEffect(() => {
    console.log("Home mounted. UserData:", userData);
  });

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
      if (!auth) {
        if (isWeb) alert('Authentication not ready. Please try again shortly.');
        else Alert.alert('Error', 'Authentication not ready. Please try again shortly.');
        return;
      }
      await signOut(auth);
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
    // If guest, return a minimal, non-user-specific payload so Home can render
    if (isGuest) {
      return {
        biography: 'Welcome to Universal Athletics',
        connectionsLabel: 'Coaches',
        connectionsCount: 0,
        requestsLabel: '',
        sessionRequestsLabel: ''
      };
    }

    if (!userData) return null;

    if (userData.userType === 'COACH') {
      return {
        biography: userData.biography1 || userData.biography2 || 'No biography available',
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

  // Debug: surface why Home might be stuck in loading
  console.log('Home state -- isLoading:', isLoading, 'isDetectingUserType:', isDetectingUserType);
  console.log('Home state -- userData present:', !!userData, 'userData:', userData);
  console.log('Home state -- userSpecificData:', userSpecificData);

  // Show loading state while user data is being fetched or user type is being detected
  // For guests, skip the user-data gate and show the generic home UI.
  if ((!isGuest && (isLoading || isDetectingUserType || !userData || !userSpecificData)) ) {
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
    setImageError
  };

  // Render appropriate UI based on platform and screen size
  if (isWeb && isLargeScreen) {
    return <HomeWebUI {...uiProps} />;
  }

  // Mobile/Tablet Layout
  return <HomeMobileUI {...uiProps} />;
}

export default Home
