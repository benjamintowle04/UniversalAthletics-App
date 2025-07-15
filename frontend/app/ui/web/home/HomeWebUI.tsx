import React from 'react';
import { View, Text, Button, Image, ActivityIndicator, ScrollView, Dimensions } from 'react-native';

interface HomeWebUIProps {
  userData: any;
  userSpecificData: any;
  imageLoading: boolean;
  imageError: boolean;
  isLoggingOut: boolean;
  isWeb: boolean;
  handleLogout: () => void;
  handleImageLoadStart: () => void;
  handleImageLoadEnd: () => void;
  handleImageError: (e: any) => void;
  testImageUrl: () => void;
  setImageLoading: (loading: boolean) => void;
  setImageError: (error: boolean) => void;
}

const HomeWebUI: React.FC<HomeWebUIProps> = ({
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
}) => {
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
                          src={require('../../../images/logo.png')}
                          alt="Default"
                          className="w-48 h-48 rounded-full object-cover border-4 border-gray-200"
                        />
                      ) : (
                        <Image
                          source={require('../../../images/logo.png')}
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
                      src={require('../../../images/logo.png')}
                      alt="Default"
                      className="w-48 h-48 rounded-full object-cover border-4 border-gray-200"
                    />
                  ) : (
                    <Image
                      source={require('../../../images/logo.png')}
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
                  {userData.sentSessionRequests?.filter((req: { status: string }) => req.status === 'PENDING').length || 0} Sent Requests
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeWebUI;
