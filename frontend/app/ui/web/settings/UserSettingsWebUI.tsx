import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, ActivityIndicator, ScrollView, Dimensions, Alert, Platform } from 'react-native';
import { updateMemberProfile, updateCoachProfile } from '../../../../controllers/ProfileUpdateController';
import { useUser } from '../../../contexts/UserContext';
import * as ImagePicker from "expo-image-picker";
import { FIREBASE_AUTH } from '../../../../firebase_config';
import { sendPasswordResetEmail } from "firebase/auth";

 

interface UserSettingsWebUIProps {
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
  onProfileUpdate?: (updatedData: any) => void;
  navigation?: any;
}

const UserSettingsWebUI: React.FC<UserSettingsWebUIProps> = ({
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
  onProfileUpdate,
  navigation
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    biography: userData?.biography || userData?.biography1 || '',
    biography2: userData?.biography2 || '',
    location: userData?.location || '',
  });
  const { setUserData } = useUser();

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | undefined>(userData?.profilePic || "NONE");
  // Keep a backup of the original image while editing so we can restore on cancel
  const [originalProfileImageUri, setOriginalProfileImageUri] = useState<string | undefined>(userData?.profilePic || "NONE");

  useEffect(() => {
    console.log("Profile Image URI in User Settings is : ", profileImageUri)
  }, [profileImageUri]);

  // Debug: log when the underlying userData.profilePic changes (signed url arrival)
  useEffect(() => {
    console.log('Underlying userData.profilePic changed:', userData?.profilePic);
    // If the backend provided a new URL, update the UI immediately
    if (userData?.profilePic && userData.profilePic !== profileImageUri) {
      setProfileImageUri(userData.profilePic);
      setOriginalProfileImageUri(userData.profilePic);
    }
  }, [userData?.profilePic]);

  // Sync original/profile image when underlying userData changes (e.g., after load)
  useEffect(() => {
    const initial = userData?.profilePic || "NONE";
    setProfileImageUri(initial);
    setOriginalProfileImageUri(initial);
  }, [userData]);

  const pickProfileImage = async () => {
    try {
      // Request permissions for mobile
      if (!isWeb) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant permission to access your photos');
          return;
        }
      }
  
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });
    
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImageUri = result.assets[0].uri;
    
        setProfileImageUri(selectedImageUri);
        
        
        console.log('Image selected:', selectedImageUri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset to original data when canceling
      setEditData({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        biography: userData?.biography || userData?.biography1 || '',
        biography2: userData?.biography2 || '',
        location: userData?.location || '',
      });
      // Restore the profile image that was present before editing
      setProfileImageUri(originalProfileImageUri);
    }
    // If we're entering edit mode, save the current image so it can be restored if canceled
    if (!isEditing) {
      setOriginalProfileImageUri(profileImageUri);
    }

    setIsEditing(!isEditing);
  };

   const handleChangePassword = async () => {
    setIsChangingPassword(true);
    try {
      if (!userData?.email) {
        alert('No email found for this account.');
        return;
      }
      console.log("Sending password reset email to:", userData.email);
      await sendPasswordResetEmail(FIREBASE_AUTH, userData.email);
      alert('Password reset email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      alert('Failed to send password reset email. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      console.log("Profile Pic Url before save:", profileImageUri);
      let updatedData;

      if (userData.userType === 'MEMBER') {
        const memberUpdateData = {
          firstName: editData.firstName,
          lastName: editData.lastName,
          email: editData.email,
          phone: editData.phone,
          biography: editData.biography,
          location: editData.location,
          skills: userData.skills || [],
          firebaseId: userData.firebaseID || userData.firebaseId, 
          profilePic: profileImageUri ?? undefined
        };

        updatedData = await updateMemberProfile(memberUpdateData, profileImageUri);
        console.log('Member profile update result:', updatedData);
        
        if (onProfileUpdate) {
          onProfileUpdate({ ...userData, ...memberUpdateData });
        }
        
      } else if (userData.userType === 'COACH') {
        const coachUpdateData = {
          firstName: editData.firstName,
          lastName: editData.lastName,
          email: editData.email,
          phone: editData.phone,
          biography1: editData.biography,
          biography2: editData.biography2,
          location: editData.location,
          skills: userData.skills || [],
          firebaseId: userData.firebaseID || userData.firebaseId,
          profileImageUri: profileImageUri
        };
        

        updatedData = await updateCoachProfile(coachUpdateData, profileImageUri);
        console.log('Coach profile update result:', coachUpdateData);
        
        // Save to local context
        if (updatedData) {
          setUserData(updatedData); 
          if (onProfileUpdate) {
            onProfileUpdate(updatedData);
          }
        }
      }

      setIsEditing(false);
  // After a successful save, update the original image backup to the current saved image
  setOriginalProfileImageUri(profileImageUri);
      
      if (Platform.OS === 'web') {
        alert('Profile updated successfully!');
      } else {
        Alert.alert('Success', 'Profile updated successfully!');
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
      if (Platform.OS === 'web') {
        alert('Failed to update profile. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="web-container py-8 px-4">
        <View className="web-card bg-white p-8 max-w-4xl mx-auto">
          {/* Header with Edit/Save and Logout Buttons */}
          <View className="mb-8 flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {userData.firstName}!
              </Text>
              <Text className="text-gray-600 text-lg">
                {userData.userType === 'COACH' ? 'Coach Dashboard' : 'Member Dashboard'}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {isEditing ? 'Edit your profile information' : 'Here\'s your profile information'}
              </Text>
            </View>
            <View className="ml-4 flex-row gap-2">
              {isWeb ? (
                <>
                  <button
                    onClick={isEditing ? (isSaving ? undefined : handleSave) : handleEditToggle}
                    disabled={isSaving}
                    className={`${
                      isEditing 
                        ? 'bg-green-500 hover:bg-green-600 disabled:bg-green-300' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    } text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2`}
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      isEditing ? 'Save Changes' : 'Edit Profile'
                    )}
                  </button>

                  <button
                    onClick={handleChangePassword}
                    disabled={isChangingPassword}
                    className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </button>
                  {isEditing && (
                    <button
                      onClick={handleEditToggle}
                      disabled={isSaving}
                      className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  )}
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
                </>
              ) : (
                <>
                  <Button
                    title={isSaving ? "Saving..." : (isEditing ? "Save" : "Edit")}
                    onPress={isEditing ? handleSave : handleEditToggle}
                    disabled={isSaving}
                    color={isEditing ? "#10B981" : "#3B82F6"}
                  />
                  {isEditing && (
                    <Button
                      title="Cancel"
                      onPress={handleEditToggle}
                      disabled={isSaving}
                      color="#6B7280"
                    />
                  )}
                  <Button
                    title={isLoggingOut ? "Logging out..." : "Logout"}
                    onPress={handleLogout}
                    disabled={isLoggingOut}
                    color="#EF4444"
                  />
                </>
              )}
            </View>
          </View>

          {/* Profile Section */}
          <View className="flex-row gap-8 mb-8 flex-wrap lg:flex-nowrap">
              {/* Profile Section */}
              <View className="flex-row gap-8 mb-8 flex-wrap lg:flex-nowrap">
                {/* Profile Picture */}
                 <View className="items-start mb-0">
                    <Image
                      // Use explicit pixel sizes for consistent small display across web/native
                      source={profileImageUri === "NONE" ? require("../../../images/logo.png") : { uri: profileImageUri }}
                      style={{ width: 100, height: 100, borderRadius: 24, borderWidth: 2, borderColor: '#3b82f6', marginBottom: 8 }}
                      resizeMode="cover"
                      onLoadStart={handleImageLoadStart}
                      onLoadEnd={handleImageLoadEnd}
                      onError={handleImageError}
                    />
                  {isEditing && (
                    <>
                      <button
                        type="button"
                        onClick={pickProfileImage}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg font-semibold text-sm mt-2"
                        disabled={isSaving}
                      >
                        Change Photo
                      </button>
                    </>
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
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSaving}
                    />
                  ) : (
                    <Text className="text-gray-900 text-lg">{userData.firstName}</Text>
                  )}
                </View>
                
                <View>
                  <Text className="font-semibold text-gray-700 mb-1">Last Name:</Text>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSaving}
                    />
                  ) : (
                    <Text className="text-gray-900 text-lg">{userData.lastName}</Text>
                  )}
                </View>
                
                <View>
                  <Text className="font-semibold text-gray-700 mb-1">Email:</Text>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSaving}
                    />
                  ) : (
                    <Text className="text-gray-900 text-lg">{userData.email}</Text>
                  )}
                </View>
                
                <View>
                  <Text className="font-semibold text-gray-700 mb-1">Phone:</Text>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSaving}
                    />
                  ) : (
                    <Text className="text-gray-900 text-lg">{userData.phone}</Text>
                  )}
                </View>
                
                <View>
                  <Text className="font-semibold text-gray-700 mb-1">Bio:</Text>
                  {isEditing ? (
                    <textarea
                      value={editData.biography}
                      onChange={(e) => setEditData({...editData, biography: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-vertical"
                      disabled={isSaving}
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <Text className="text-gray-900 text-lg leading-relaxed">
                      {userSpecificData.biography}
                    </Text>
                  )}
                </View>

                {/* Coach-specific fields */}
                {userData.userType === 'COACH' && (
                  <View>
                    <Text className="font-semibold text-gray-700 mb-1">Additional Bio:</Text>
                    {isEditing ? (
                      <textarea
                        value={editData.biography2}
                        onChange={(e) => setEditData({...editData, biography2: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-vertical"
                        disabled={isSaving}
                        placeholder="Additional information about your coaching experience..."
                      />
                    ) : (
                      <Text className="text-gray-900 text-lg leading-relaxed">
                        {userData.biography2 || 'No additional bio provided'}
                      </Text>
                    )}
                  </View>
                )}

                <View>
                  <Text className="font-semibold text-gray-700 mb-1">Location:</Text>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isSaving}
                      placeholder="Your location"
                    />
                  ) : (
                    <Text className="text-gray-900 text-lg">{userData.location || 'No location provided'}</Text>
                  )}
                </View>

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
          <View className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            {/* Skills Management Section */}
            <View className="bg-gray-50 p-6 rounded-lg">
              <Text className="text-xl font-semibold text-gray-900 mb-4">
                Skills Management
              </Text>
              
              <View className="flex-row items-center gap-4 mb-4">
                <View className="bg-purple-100 px-4 py-2 rounded-full">
                  <Text className="text-purple-800 font-semibold">
                    {userData.userType === 'COACH' 
                      ? (userData.skillsWithLevels?.length || 0) 
                      : (userData.skills?.length || 0)
                    } Skills Selected
                  </Text>
                </View>
              </View>

              <Text className="text-gray-600 mb-4 text-sm">
                {userData.userType === 'COACH' 
                  ? 'Manage your coaching skills and expertise levels.'
                  : 'Select your athletic interests and skills.'
                }
              </Text>

              {isWeb ? (
                <button
                  onClick={() => navigation?.navigate?.('SkillsManagement')}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm"
                >
                  Manage Skills
                </button>
              ) : (
                <Button
                  title="Manage Skills"
                  onPress={() => navigation?.navigate?.('SkillsManagement')}
                  color="#8B5CF6"
                />
              )}
            </View>
          </View>
        </View>
      </View>
      </View>
    </ScrollView>
  );
};

export default UserSettingsWebUI;
