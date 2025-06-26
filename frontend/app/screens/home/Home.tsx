import { View, Text, Button, Image, Alert, ActivityIndicator, Platform, Dimensions, ScrollView } from 'react-native'
import React, { useState, useCallback } from 'react'
import { FIREBASE_AUTH } from '../../../firebase_config';
import { RouterProps } from '../../types/RouterProps';
import { useUser } from '../../contexts/UserContext';
import { signOut } from 'firebase/auth';
import '../../../global.css';

const Home = ({ navigation }: RouterProps) => {    
  const auth = FIREBASE_AUTH;
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

  // Web Layout
  if (isWeb && isLargeScreen) {
    return (
      <ScrollView className="flex-1 bg-gray-100">
        <View className="web-container py-8 px-4">
          <View className="web-card bg-white p-8 max-w-4xl mx-auto">
            {/* Header with Logout Button */}
            <View className="mb-8 flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome, {userData.firstName}!
                </Text>
                <Text className="text-gray-600 text-lg">
                  {userData.userType === 'COACH' ? 'Coach Dashboard' : 'Member Dashboard'}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Here's your profile information
                </Text>
              </View>
              <View className="ml-4">
                {isWeb ? (
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                  >
                    {isLoggingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Logging out...
                      </>
                    ) : (
                      'Logout'
                    )}
                  </button>
                ) : (
                  <Button
                    title={isLoggingOut ? "Logging out..." : "Logout"}
                    onPress={handleLogout}
                    disabled={isLoggingOut}
                    color="#EF4444"
                  />
                )}
              </View>
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
                <Text className="text-xl font-semibold text-gray-900 mb-6">
                  {userData.userType === 'COACH' ? 'Coach Information' : 'Personal Information'}
                </Text>
                
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
                  
                  <View>
                    <Text className="font-semibold text-gray-700 mb-1">Bio:</Text>
                    <Text className="text-gray-900 text-lg leading-relaxed">
                      {userSpecificData.biography}
                    </Text>
                  </View>

                  {/* Coach-specific fields */}
                  {userData.userType === 'COACH' && (
                    <>
                      {userData.biography2 && userData.biography2 !== userData.biography1 && (
                        <View>
                          <Text className="font-semibold text-gray-700 mb-1">Additional Bio:</Text>
                          <Text className="text-gray-900 text-lg leading-relaxed">
                            {userData.biography2}
                          </Text>
                        </View>
                      )}
                    </>
                  )}

                  {/* Skills Section */}
                  {userData.skills && userData.skills.length > 0 && (
                    <View>
                      <Text className="font-semibold text-gray-700 mb-2">Skills:</Text>
                      <View className="flex-row flex-wrap gap-2">
                        {userData.skills.map((skill: any, index: number) => (
                          <View key={index} className="bg-blue-100 px-3 py-1 rounded-full">
                            <Text className="text-blue-800 text-sm capitalize">
                              {skill.title || skill.name || skill}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Dashboard Stats Section */}
            <View className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Connection Requests Section */}
              <View className="bg-gray-50 p-6 rounded-lg">
                <Text className="text-xl font-semibold text-gray-900 mb-4">
                  {userSpecificData.requestsLabel}
                </Text>
                
                <View className="flex-row items-center gap-4 mb-4">
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

                <View className="bg-green-100 px-4 py-2 rounded-full inline-block">
                  <Text className="text-green-800 font-semibold">
                    {userSpecificData.connectionsCount} Connected {userSpecificData.connectionsLabel}
                  </Text>
                </View>
              </View>

              {/* Session Requests Section */}
              <View className="bg-gray-50 p-6 rounded-lg">
                <Text className="text-xl font-semibold text-gray-900 mb-4">
                  {userSpecificData.sessionRequestsLabel}
                </Text>
                
                <View className="flex-row items-center gap-4 mb-4">
                  <View className="bg-purple-500 px-4 py-2 rounded-full">
                    <Text className="text-white font-semibold">
                      {userData.pendingSessionRequests?.length || 0} Pending
                    </Text>
                  </View>
                  
                  {userData.isLoadingSessionRequests && (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator size="small" color="#6B7280" />
                      <Text className="text-gray-500 italic">
                        Loading session requests...
                      </Text>
                    </View>
                  )}
                </View>

                <View className="bg-orange-100 px-4 py-2 rounded-full inline-block">
                  <Text className="text-orange-800 font-semibold">
                    {userData.sentSessionRequests?.filter(req => req.status === 'PENDING').length || 0} Sent Requests
                  </Text>
                </View>
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
        {/* Header with Logout Button */}
        <View className="mb-6 flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {userData.firstName}!
            </Text>
            <Text className="text-gray-600 text-base">
              {userData.userType === 'COACH' ? 'Coach Dashboard' : 'Member Dashboard'}
            </Text>
          </View>
          <View className="ml-4">
            <Button
              title={isLoggingOut ? "Logging out..." : "Logout"}
              onPress={handleLogout}
              disabled={isLoggingOut}
              color="#EF4444"
            />
          </View>
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
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            {userData.userType === 'COACH' ? 'Coach Information' : 'Personal Information'}
          </Text>
          
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
            
            <View>
              <Text className="font-semibold text-gray-700">Bio:</Text>
              <Text className="text-gray-900 leading-relaxed">
                {userSpecificData.biography}
              </Text>
            </View>

            {/* Coach-specific additional bio */}
            {userData.userType === 'COACH' && userData.biography2 && userData.biography2 !== userData.biography1 && (
              <View>
                <Text className="font-semibold text-gray-700">Additional Bio:</Text>
                <Text className="text-gray-900 leading-relaxed">
                  {userData.biography2}
                </Text>
              </View>
            )}

            {/* Skills */}
            {userData.skills && userData.skills.length > 0 && (
              <View>
                <Text className="font-semibold text-gray-700 mb-2">Skills:</Text>
                <View className="flex-row flex-wrap gap-2">
                  {userData.skills.map((skill: any, index: number) => (
                    <View key={index} className="bg-blue-100 px-3 py-1 rounded-full">
                      <Text className="text-blue-800 text-sm capitalize">
                        {skill.title || skill.name || skill}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

      </View>
    </ScrollView>
  )
}

export default Home

                 
