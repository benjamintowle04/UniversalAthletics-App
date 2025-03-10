import React, { useState, useContext } from "react";
import { View, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ProfilePictureContainer } from "../../components/image_holders/ProfilePictureContainerEdit";
import { HeaderText } from "../../components/text/HeaderText";
import { PrimaryButton } from "../../components/buttons/PrimaryButton";
import { LogoImageContainer } from "../../components/image_holders/LogoImageContainer";
import { UserContext } from "../../contexts/UserContext";
import { SubHeaderText1 } from "../../components/text/SubHeaderText1";
import { EditTextField } from "../../components/text/input/EditTextField";
import { EditEmailField } from "../../components/text/input/EditEmailField";
import { EditPhoneField } from "../../components/text/input/EditPhoneField";
import { SmallText } from "../../components/text/SmallText";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RouterProps } from "../../types/RouterProps";
import { EditBioField } from "../../components/text/input/EditBioField";
import { postUserOnboarding } from "../../../controllers/OnboardingController";

const AccountSummary = ({ navigation }: RouterProps) => {
  const userContext = useContext(UserContext);

  if (!userContext) {
    Alert.alert("Error loading User Data");
    return null;
  }

  const { userData, setUserData } = userContext;
  const [imageUri, setImageUri] = useState<string | null>(userData.profilePicture || null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setUserData({ ...userData, profilePicture: result.assets[0].uri });
    }
  };

  const handleFieldChange = (key: string, value: string) => {
    setUserData({
      ...userData,
      [key]: value,
    });
  };

  const handleButtonPress = async () => {
    if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone) {
      Alert.alert("Missing Information", "Please fill out all required fields before proceeding.");
      return;
    }

    if (!imageUri) {
      
    }
  
    try {
      const response = await postUserOnboarding(userData, imageUri);
      console.log("User Data at the end of onboarding:", response);
      navigation.navigate("Home");
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <View className="flex-1 items-center bg-white p-4">
      <LogoImageContainer />
      <HeaderText text="Thank you for Joining UA!" />
      <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={80} extraHeight={120}>
        <View className="flex-row items-center justify-between w-full">
          <ProfilePictureContainer imageUri={imageUri} onPickImage={pickImage} />
          <View className="mt-8 px-6">
            <SubHeaderText1 text="Account Summary" />
            <View className="flex-row items-start">
              <View className="pr-1">
                <SmallText text="First" />
              </View>
              <EditTextField value={userData.firstName} onChange={(text) => handleFieldChange("firstName", text)} />
            </View>
            <View className="flex-row items-start">
              <View className="pr-1">
                <SmallText text="Last" />
              </View>
              <EditTextField value={userData.lastName} onChange={(text) => handleFieldChange("lastName", text)} />
            </View>
          </View>
        </View>

        <View className="flex-2 justify-start">
          <View className="flex-row items-start">
            <View className="pr-1">
              <SmallText text="Email" />
            </View>
            <EditEmailField value={userData.email} onChange={(text) => handleFieldChange("email", text)} />
          </View>

          <View className="flex-row items-start">
            <View className="pr-1">
              <SmallText text="Phone" />
            </View>
            <EditPhoneField value={userData.phone} onChange={(text) => handleFieldChange("phone", text)} />
          </View>

          <View className="flex-row items-start">
            <View className="pr-1">
              <SmallText text="Bio" />
            </View>
            <EditBioField value={userData.biography} onChange={(text) => handleFieldChange("biography", text)} />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View>
          <PrimaryButton title="Get Started" onPress={handleButtonPress} />
      </View>
    </View>
  );
};

export default AccountSummary;
