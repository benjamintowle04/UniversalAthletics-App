import { View, Text, Button, Image, Alert, ActivityIndicator, Platform, Dimensions, ScrollView } from 'react-native'
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { FIREBASE_AUTH } from '../../../firebase_config';
import { RouterProps } from '../../types/RouterProps';
import { useUser } from '../../contexts/UserContext';
import { getMemberByFirebaseId } from '../../../controllers/MemberInfoController';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../../../global.css';

const Home = ({ navigation }: RouterProps) => {    
  const auth = FIREBASE_AUTH;
  const { userData, setUserData, isLoading} = useUser();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [localLoading, setLocalLoading] = useState(false); // Add local loading state
  const hasAttemptedSignIn = useRef(false);
  const hasAttemptedDataFetch = useRef(false);

  // Platform detection
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  // Auto sign in - only run once when component mounts
  useEffect(() => {
    const autoSignIn = async () => {
      if (hasAttemptedSignIn.current || auth.currentUser) {
        return;
      }

      hasAttemptedSignIn.current = true;
      
      try {
        await signInWithEmailAndPassword(auth, 'test@gmail.com', 'Test123!');
        console.log('Auto sign-in successful');
      } catch (error) {
        console.error('Auto sign-in failed:', error);
      }
    }; 
    
    autoSignIn();
  }, []);

  // Fetch user data only once when authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (hasAttemptedDataFetch.current || localLoading) {
        return;
      }
      
      hasAttemptedDataFetch.current = true;
      
      try {
        console.log("Fetching user data by firebase ID:", auth.currentUser?.uid);
        const memberData = await getMemberByFirebaseId(auth.currentUser?.uid || "");
        console.log("Profile picture URL received:", memberData.profilePic);
        setUserData(memberData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        hasAttemptedDataFetch.current = false; 
      } finally {
        setLocalLoading(false);
      }
    };

    if (auth.currentUser && !userData && !isLoading) {
      fetchUserData();
    }
  }, [auth.currentUser, userData, isLoading, setUserData, localLoading]); 

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

  // Show loading state while user data is being fetched
  if (isLoading || localLoading || !userData) {
    return (
      <View className={`flex-1 justify-center items-center ${isWeb ? 'min-h-screen bg-gray-100' : ''}`}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Loading user data...</Text>
      </View>
    );
  }

  // Web Layout
  if (isWeb && isLargeScreen) {
    return (
      <ScrollView className="flex-1 bg-gray-100">
        <View className="web-container py-8 px-4">
          <View className="web-card bg-white p-8 max-w-4xl mx-auto">
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {userData.firstName}!
              </Text>
              <Text className="text-gray-600 text-lg">
                Here's your profile information
              </Text>
            </View>

            {/* Profile Section */}
            <View className="flex-row gap-8 mb-8 flex-wrap lg:flex-nowrap">
              {/* Profile Picture */}
              <View className="flex-shrink-0 items-center">
                <Text className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</Text>
                
                {userData.profilePic ? (
                  <View className="items-center">
                    {imageLoading && (
                      <View className="mb-4 items-center">
                        <ActivityIndicator size="large" color="#3B82F6" />
                        <Text className="text-gray-500 mt-2">Loading image...</Text>
                      </View>
                    )}
                    
                    {/* Web Image */}
                    {isWeb ? (
                      <img
                        src={userData.profilePic}
                        alt="Profile"
                        className={`w-48 h-48 rounded-full object-cover border-4 border-gray-200 shadow-lg ${imageError ? 'hidden' : 'block'}`}
                        onLoad={() => {
                          console.log("Web image loaded successfully");
                          setImageLoading(false);
                        }}
                        onError={(e) => {
                          console.error("Web image failed to load:", e);
                          setImageError(true);
                          setImageLoading(false);
                        }}
                      />
                    ) : (
                      <Image
                        source={{ uri: userData.profilePic }}
                        className={`w-48 h-48 rounded-full ${imageError ? 'hidden' : 'flex'}`}
                        resizeMode="cover"
                        onLoadStart={handleImageLoadStart}
                        onLoadEnd={handleImageLoadEnd}
                        onError={handleImageError}
                      />
                    )}
                    
                    {imageError && (
                      <View className="items-center">
                        <Text className="text-red-500 mb-2 text-center">
                          Failed to load profile image
                        </Text>
                        {isWeb ? (
                          <img
                            src={require('../../images/logo.png')}
                            alt="Default"
                            className="w-48 h-48 rounded-full object-cover border-4 border-gray-200"
                          />
                        ) : (
                          <Image
                            source={require('../../images/logo.png')}
                            className="w-48 h-48 rounded-full"
                            resizeMode="cover"
                          />
                        )}
                      </View>
                    )}
                    
                    {/* Debug Info */}
                    <View className="mt-4 items-center">
                      <Text className="text-xs text-gray-500 mb-2 text-center">
                        URL: {userData.profilePic.substring(0, 50)}...
                      </Text>
                      <Button title="Test URL" onPress={testImageUrl} />
                    </View>
                  </View>
                ) : (
                  <View className="items-center">
                    {isWeb ? (
                      <img
                        src={require('../../images/logo.png')}
                        alt="Default"
                        className="w-48 h-48 rounded-full object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <Image
                        source={require('../../images/logo.png')}
                        className="w-48 h-48 rounded-full"
                        resizeMode="cover"
                      />
                    )}
                    <Text className="text-gray-500 mt-2">No profile picture</Text>
                  </View>
                )}
              </View>

              {/* User Information */}
              <View className="flex-1 min-w-0">
                <Text className="text-xl font-semibold text-gray-900 mb-6">Personal Information</Text>
                
                <View className="space-y-4">
                  <View>
                    <Text className="font-semibold text-gray-700 mb-1">First Name:</Text>
                    <Text className="text-gray-900 text-lg">{userData.firstName}</Text>
                  </View>
                  
                  <View>
                    <Text className="font-semibold text-gray-700 mb-1">Last Name:</Text>
                    <Text className="text-gray-900 text-lg">{userData.lastName}</Text>
                  </View>
                  
                  <View>
                    <Text className="font-semibold text-gray-700 mb-1">Email:</Text>
                    <Text className="text-gray-900 text-lg">{userData.email}</Text>
                  </View>
                  
                  <View>
                    <Text className="font-semibold text-gray-700 mb-1">Phone:</Text>
                    <Text className="text-gray-900 text-lg">{userData.phone}</Text>
                  </View>
                  
                  {userData.biography && (
                    <View>
                      <Text className="font-semibold text-gray-700 mb-1">Bio:</Text>
                      <Text className="text-gray-900 text-lg leading-relaxed">
                        {userData.biography}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Connection Requests Section */}
            <View className="bg-gray-50 p-6 rounded-lg">
              <Text className="text-xl font-semibold text-gray-900 mb-4">Connection Requests</Text>
              
              <View className="flex-row items-center gap-4">
                <View className="bg-ua-blue px-4 py-2 rounded-full">
                  <Text className="text-white font-semibold">
                    {userData.pendingConnectionRequests?.length || 0} Pending
                  </Text>
                </View>
                
                {userData.isLoadingRequests && (
                  <View className="flex-row items-center gap-2">
                    <ActivityIndicator size="small" color="#6B7280" />
                    <Text className="text-gray-500 italic">
                      Loading connection requests...
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Mobile/Tablet Layout
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {userData.firstName}!
          </Text>
        </View>

        {/* Profile Picture */}
        <View className="items-center mb-6">
          {userData.profilePic ? (
            <View className="items-center">
              {imageLoading && (
                <View className="mb-4">
                  <ActivityIndicator size="large" color="#3B82F6" />
                </View>
              )}
              
              <Image
                source={{ uri: userData.profilePic }}
                className={`w-32 h-32 rounded-full ${imageError ? 'hidden' : 'flex'}`}
                resizeMode="cover"
                onLoadStart={handleImageLoadStart}
                onLoadEnd={handleImageLoadEnd}
                onError={handleImageError}
              />
              
              {imageError && (
                <View className="items-center">
                  <Text className="text-red-500 mb-2 text-center">Failed to load image</Text>
                  <Image
                    source={require('../../images/logo.png')}
                    className="w-32 h-32 rounded-full"
                    resizeMode="cover"
                  />
                </View>
              )}
              
              <View className="mt-2">
                <Button title="Test URL" onPress={testImageUrl} />
              </View>
            </View>
          ) : (
            <View className="items-center">
              <Image
                source={require('../../images/logo.png')}
                className="w-32 h-32 rounded-full"
                resizeMode="cover"
              />
              <Text className="text-gray-500 mt-2">No profile picture</Text>
            </View>
          )}
        </View>

        {/* User Information */}
        <View className="bg-gray-50 p-4 rounded-lg mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Personal Information</Text>
          
          <View className="space-y-3">
            <View>
              <Text className="font-semibold text-gray-700">First Name:</Text>
              <Text className="text-gray-900">{userData.firstName}</Text>
            </View>
            
            <View>
              <Text className="font-semibold text-gray-700">Last Name:</Text>
              <Text className="text-gray-900">{userData.lastName}</Text>
            </View>
            
            <View>
              <Text className="font-semibold text-gray-700">Email:</Text>
              <Text className="text-gray-900">{userData.email}</Text>
            </View>
            
            <View>
              <Text className="font-semibold text-gray-700">Phone:</Text>
              <Text className="text-gray-900">{userData.phone}</Text>
            </View>
            
            {userData.biography && (
              <View>
                <Text className="font-semibold text-gray-700">Bio:</Text>
                <Text className="text-gray-900 leading-relaxed">
                  {userData.biography}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Home
