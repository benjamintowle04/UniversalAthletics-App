import React, { useState } from "react";
import { View, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import {ProfilePictureContainer} from "../../components/image_holders/ProfilePictureContainer"; 
import { HeaderText } from "../../components/text/HeaderText";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import {LogoImageContainer} from "../../components/image_holders/LogoImageContainer";

const ProfilePictureUpload = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square crop
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <LogoImageContainer />

      <View className="left-0 flex-row items-center justify-between w-full">
        <ProfilePictureContainer imageUri={imageUri} onPickImage={pickImage} />
      </View>

      <View className="mt-6 w-full px-6">
        <Text className="text-xl font-bold text-gray-800">Account Summary</Text>
        <View className="mt-3 p-4 bg-gray-100 rounded-lg w-full">
          <Text className="text-gray-700">
            <Text className="font-semibold">Name:</Text> John Doe
          </Text>
          <Text className="text-gray-700 mt-2">
            <Text className="font-semibold">Email:</Text> johndoe@example.com
          </Text>
          <Text className="text-gray-700 mt-2">
            <Text className="font-semibold">Membership:</Text> Premium User
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ProfilePictureUpload;
