import React from 'react';
import { View, Text, Button, Image, ActivityIndicator, ScrollView } from 'react-native';

interface HomeMobileUIProps {
  userData: any;
  userSpecificData: any;
  imageLoading: boolean;
  imageError: boolean;
  isLoggingOut: boolean;
  handleLogout: () => void;
  handleImageLoadStart: () => void;
  handleImageLoadEnd: () => void;
  handleImageError: (e: any) => void;
  testImageUrl: () => void;
}

const HomeMobileUI: React.FC<HomeMobileUIProps> = ({
  userData,
  userSpecificData,
  imageLoading,
  imageError,
  isLoggingOut,
  handleLogout,
  handleImageLoadStart,
  handleImageLoadEnd,
  handleImageError,
  testImageUrl
}) => {
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
                    source={require('../../../images/logo.png')}
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
                source={require('../../../images/logo.png')}
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

        {/* Dashboard Stats Section - Mobile Version */}
        <View className="space-y-4">
          {/* Connection Requests Section */}
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              {userSpecificData.requestsLabel}
            </Text>
            
            <View className="mb-3">
              <View className="bg-ua-blue px-3 py-2 rounded-full mb-2 self-start">
                <Text className="text-white font-semibold text-sm">
                  {userData.pendingConnectionRequests?.length || 0} Pending
                </Text>
              </View>
              
              {userData.isLoadingRequests && (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" color="#6B7280" />
                  <Text className="text-gray-500 italic text-sm">
                    Loading connection requests...
                  </Text>
                </View>
              )}
            </View>

            <View className="bg-green-100 px-3 py-2 rounded-full self-start">
              <Text className="text-green-800 font-semibold text-sm">
                {userSpecificData.connectionsCount} Connected {userSpecificData.connectionsLabel}
              </Text>
            </View>
          </View>

          {/* Session Requests Section */}
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              {userSpecificData.sessionRequestsLabel}
            </Text>
            
            <View className="mb-3">
              <View className="bg-purple-500 px-3 py-2 rounded-full mb-2 self-start">
                <Text className="text-white font-semibold text-sm">
                  {userData.pendingSessionRequests?.length || 0} Pending
                </Text>
              </View>
              
              {userData.isLoadingSessionRequests && (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" color="#6B7280" />
                  <Text className="text-gray-500 italic text-sm">
                    Loading session requests...
                  </Text>
                </View>
              )}
            </View>

            <View className="bg-orange-100 px-3 py-2 rounded-full self-start">
              <Text className="text-orange-800 font-semibold text-sm">
                {userData.sentSessionRequests?.filter((req: {status: string}) => req.status === 'PENDING').length || 0} Sent Requests
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeMobileUI;
