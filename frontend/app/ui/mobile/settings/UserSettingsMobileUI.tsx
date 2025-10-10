import React, { useState, useEffect} from 'react';
import { View, Text, Button, Image, ActivityIndicator, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { updateMemberProfile, updateCoachProfile } from '../../../../controllers/ProfileUpdateController';
import { useUser } from '../../../contexts/UserContext';
import * as ImagePicker from "expo-image-picker";
import { FIREBASE_AUTH } from '../../../../firebase_config';
import { sendPasswordResetEmail } from "firebase/auth";

interface UserSettingsMobileUIProps {
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
  onProfileUpdate?: (updatedData: any) => void;
  navigation?: any;
}

const UserSettingsMobileUI: React.FC<UserSettingsMobileUIProps> = ({
  userData,
  userSpecificData,
  imageLoading,
  imageError,
  isLoggingOut,
  handleLogout,
  handleImageLoadStart,
  handleImageLoadEnd,
  handleImageError,
  testImageUrl,
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
  // Keep the profile image URI as a string or null. Use the bundled logo as a fallback
  // when actually rendering the Image to avoid passing an empty/invalid uri to <Image />.
  const [profileImageUri, setProfileImageUri] = useState<string | null>(
    userData?.profilePic ? userData.profilePic : null
  );
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    console.log("Profile Image URI in User Settings is : ", profileImageUri)
  }, [profileImageUri]);


  const handleChangePassword = async () => {  
    setIsChangingPassword(true);
    try {
      if (!userData?.email) {
        Alert.alert('Error', 'No email found for this account.');
        return;
      }
      await sendPasswordResetEmail(FIREBASE_AUTH, userData.email);
      Alert.alert('Success', 'Password reset email sent! Please check your inbox.');
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const pickProfileImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
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
      setEditData({
        firstName: userData?.firstName || '',
        lastName: userData?.lastName || '',
        email: userData?.email || '',
        phone: userData?.phone || '',
        biography: userData?.biography || userData?.biography1 || '',
        biography2: userData?.biography2 || '',
        location: userData?.location || '',
      });
      setProfileImageUri(userData?.profilePic || null);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
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
        };
        updatedData = await updateMemberProfile(memberUpdateData, profileImageUri);
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
        };
        updatedData = await updateCoachProfile(coachUpdateData, profileImageUri);
        if (updatedData) {
          setUserData(updatedData);
          if (onProfileUpdate) {
            onProfileUpdate(updatedData);
          }
        }
      }
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-5">
        {/* Header with Edit/Save and Logout Buttons */}
        <View className="mb-6">
          <View className="flex-row justify-between items-start mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Welcome, {userData.firstName}!
              </Text>
              <Text className="text-gray-600 text-base">
                {userData.userType === 'COACH' ? 'Coach Dashboard' : 'Member Dashboard'}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">
                {isEditing ? 'Edit your profile information' : 'Here\'s your profile information'}
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Button
                title={isSaving ? "Saving..." : (isEditing ? "Save" : "Edit Profile")}
                onPress={isEditing ? handleSave : handleEditToggle}
                disabled={isSaving}
                color={isEditing ? "#10B981" : "#3B82F6"}
              />

               <Button
                title={isChangingPassword ? "Sending..." : "Change Password"}
                onPress={handleChangePassword}
                disabled={isChangingPassword}
                color="#FBBF24"
              />
            </View>
            {isEditing && (
              <View className="flex-1">
                <Button
                  title="Cancel"
                  onPress={handleEditToggle}
                  disabled={isSaving}
                  color="#6B7280"
                />
              </View>
            )}
            <View className="flex-1">
              <Button
                title={isLoggingOut ? "Logging out..." : "Logout"}
                onPress={handleLogout}
                disabled={isLoggingOut}
                color="#EF4444"
              />
            </View>
          </View>
        </View>

        {/* Profile Picture */}
       <View className="items-center mb-6">
          <Image 
            source={ profileImageUri ? { uri: profileImageUri } : require('../../../images/logo.png') }
            className="w-32 h-32 rounded-full"
            resizeMode="cover"
            onLoadStart={handleImageLoadStart}
            onLoadEnd={handleImageLoadEnd}
            onError={handleImageError}
          />
          {isEditing && (
            <View className="mt-2">
              <Button
                title="Change Photo"
                onPress={pickProfileImage}
                disabled={isSaving}
                color="#3B82F6"
              />
            </View>
          )}
          {imageError && (
            <Text className="text-red-500 mb-2 text-center">Failed to load image</Text>
          )}
          <View className="mt-2">
            <Button title="Test URL" onPress={testImageUrl} />
          </View>
        </View>

        {/* User Information */}
        <View className="bg-gray-50 p-4 rounded-lg mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">
            {userData.userType === 'COACH' ? 'Coach Information' : 'Personal Information'}
          </Text>
          <View className="space-y-3">
            <View>
              <Text className="font-semibold text-gray-700 mb-1">First Name:</Text>
              {isEditing ? (
                <TextInput
                  value={editData.firstName}
                  onChangeText={(text) => setEditData({...editData, firstName: text})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  editable={!isSaving}
                />
              ) : (
                <Text className="text-gray-900">{userData.firstName}</Text>
              )}
            </View>
            <View>
              <Text className="font-semibold text-gray-700 mb-1">Last Name:</Text>
              {isEditing ? (
                <TextInput
                  value={editData.lastName}
                  onChangeText={(text) => setEditData({...editData, lastName: text})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  editable={!isSaving}
                />
              ) : (
                <Text className="text-gray-900">{userData.lastName}</Text>
              )}
            </View>
            <View>
              <Text className="font-semibold text-gray-700 mb-1">Email:</Text>
              {isEditing ? (
                <TextInput
                  value={editData.email}
                  onChangeText={(text) => setEditData({...editData, email: text})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  keyboardType="email-address"
                  editable={!isSaving}
                />
              ) : (
                <Text className="text-gray-900">{userData.email}</Text>
              )}
            </View>
            <View>
              <Text className="font-semibold text-gray-700 mb-1">Phone:</Text>
              {isEditing ? (
                <TextInput
                  value={editData.phone}
                  onChangeText={(text) => setEditData({...editData, phone: text})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  keyboardType="phone-pad"
                  editable={!isSaving}
                />
              ) : (
                <Text className="text-gray-900">{userData.phone}</Text>
              )}
            </View>
            <View>
              <Text className="font-semibold text-gray-700 mb-1">Bio:</Text>
              {isEditing ? (
                <TextInput
                  value={editData.biography}
                  onChangeText={(text) => setEditData({...editData, biography: text})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  multiline={true}
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholder="Tell us about yourself..."
                  editable={!isSaving}
                />
              ) : (
                <Text className="text-gray-900 leading-relaxed">
                  {userSpecificData.biography}
                </Text>
              )}
            </View>
            {userData.userType === 'COACH' && (
              <View>
                <Text className="font-semibold text-gray-700 mb-1">Additional Bio:</Text>
                {isEditing ? (
                  <TextInput
                    value={editData.biography2}
                    onChangeText={(text) => setEditData({...editData, biography2: text})}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                    placeholder="Additional information about your coaching experience..."
                    editable={!isSaving}
                  />
                ) : (
                  <Text className="text-gray-900 leading-relaxed">
                    {userData.biography2 || 'No additional bio provided'}
                  </Text>
                )}
              </View>
            )}
            <View>
              <Text className="font-semibold text-gray-700 mb-1">Location:</Text>
              {isEditing ? (
                <TextInput
                  value={editData.location}
                  onChangeText={(text) => setEditData({...editData, location: text})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  placeholder="Your location"
                  editable={!isSaving}
                />
              ) : (
                <Text className="text-gray-900">{userData.location || 'No location provided'}</Text>
              )}
            </View>
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
        <View className="space-y-4">
          <View className="bg-gray-50 p-4 rounded-lg">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Skills Management
            </Text>
            <View className="mb-3">
              <View className="bg-purple-100 px-3 py-2 rounded-full mb-2 self-start">
                <Text className="text-purple-800 font-semibold text-sm">
                  {userData.userType === 'COACH' 
                    ? (userData.skillsWithLevels?.length || 0) 
                    : (userData.skills?.length || 0)
                  } Skills Selected
                </Text>
              </View>
            </View>
            <Text className="text-gray-600 mb-3 text-sm">
              {userData.userType === 'COACH' 
                ? 'Manage your coaching skills and expertise levels.'
                : 'Select your athletic interests and skills.'
              }
            </Text>
            <Button
              title="Manage Skills"
              onPress={() => navigation?.navigate?.('SkillsManagement')}
              color="#8B5CF6"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserSettingsMobileUI;