import React, { useState, useContext, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ProfilePictureContainer } from "../../components/image_holders/ProfilePictureContainerEdit";
import { HeaderText } from "../../components/text/HeaderText";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { LogoImageContainer } from "../../components/image_holders/LogoImageContainer";
import { UserContext } from "../../contexts/UserContext";
import { SubHeaderText1 } from "../../components/text/SubHeaderText1";

const UploadProfilePicture = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const userContext = useContext(UserContext);

  if (!userContext) {
    Alert.alert("Error loading User Data");
    return null;
  }

  const { userData, setUserData } = userContext;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri); 
    }
  };

  return (
    <View className="flex-1 items-center bg-white p-6">
      <LogoImageContainer />
      <HeaderText text="Thank you for Joining UA!" />

      <View className="left-0 flex-row items-center justify-between w-full">
        <ProfilePictureContainer
          imageUri={imageUri || userData.profilePicture}
          onPickImage={pickImage}
        />
      </View>

      <View className="mt-6 w-full px-6">
        <Text className="text-xl font-bold text-gray-800">Account Summary</Text>
        <View className="mt-3 p-4 bg-gray-100 rounded-lg w-full">
          <Text className="text-gray-700">
            <Text className="font-semibold">Name:</Text> {userData.firstName} {userData.lastName}
          </Text>
          <Text className="text-gray-700 mt-2">
            <Text className="font-semibold">Email:</Text> {userData.email}
          </Text>
          <Text className="text-gray-700 mt-2">
            <Text className="font-semibold">Phone Number:</Text> {userData.phoneNumber}
          </Text>
          <Text className="text-gray-700 mt-2">
            <Text className="font-semibold">Bio:</Text> {userData.bio}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default UploadProfilePicture;
