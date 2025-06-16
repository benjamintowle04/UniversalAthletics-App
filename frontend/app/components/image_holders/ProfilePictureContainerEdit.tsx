import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { PencilIcon } from "lucide-react-native";

interface ProfilePictureProps {
  imageUri: string | null;
  onPickImage: () => void;
}

export const ProfilePictureContainer: React.FC<ProfilePictureProps> = ({ imageUri, onPickImage }) => (
  <View className="relative">
    <Image
      source={imageUri ? { uri: imageUri } : require("../../images/logo.png")}
      className="w-32 h-32 rounded-full border-2 border-gray-300"
      resizeMode="cover"
    />
    {/* Plus Button to Upload */}
    <TouchableOpacity
      onPress={onPickImage}
      className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full border-2 border-white shadow-lg"
    >
      <PencilIcon size={16} color="white" />
    </TouchableOpacity>
  </View>
);
