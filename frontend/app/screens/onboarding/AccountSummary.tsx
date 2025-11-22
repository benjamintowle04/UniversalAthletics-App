import React, { useState, useContext, useEffect} from "react";
import { View, Alert, Text, Dimensions, Platform, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { PencilIcon } from "lucide-react-native";
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
import { getMemberByFirebaseId } from "../../../controllers/MemberInfoController";
import { getCoachByFirebaseId } from "../../../controllers/CoachController";
import { Colors } from "../../themes/colors/Colors";
import { getFirebaseAuthSafe } from "../../../firebase_config";

interface AccountSummaryProps extends RouterProps {
  combinedUserData?: {
    firstName: string;
    lastName: string;
    phone: string;
    biography: string;
    location: string | null;
    skills: { skill_id: number, title: string }[];
  }
}

const AccountSummary = ({ navigation, route }: AccountSummaryProps) => {
  const { width, height } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  // Get the combined data from previous screens
  const combinedUserData = route?.params?.combinedUserData;

  const userContext = useContext(UserContext);

  if (!userContext) {
    Alert.alert("Error loading User Data");
    return null;
  }

  const { userData, setUserData } = userContext;
  // Use runtime-safe getter for Auth to avoid module-load failures in some web builds
  const auth = getFirebaseAuthSafe();

  // Initialize state with combined data from previous screens or existing userData
  const [firstName, setFirstName] = useState<string>(
    combinedUserData?.firstName || userData?.firstName || ''
  );
  const [lastName, setLastName] = useState<string>(
    combinedUserData?.lastName || userData?.lastName || ''
  );
  const [email, setEmail] = useState<string>(
    auth?.currentUser?.email || ''
  );
  const [phone, setPhone] = useState<string>(
    combinedUserData?.phone || userData?.phone || ''
  );
  const [biography, setBiography] = useState<string>(
    combinedUserData?.biography || ''
  );
  const [imageUri, setImageUri] = useState<string | null>(
    userData?.profilePic || null
  );


useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    // When returning to this screen, restore any data that might have been passed back
    if (route?.params?.combinedUserData) {
      const data = route.params.combinedUserData;
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setPhone(data.phone || '');
      setBiography(data.biography || '');
    }
  });

  return unsubscribe;
}, [navigation, route?.params?.combinedUserData]);

const pickImage = async () => {
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

      console.log('Selected image URI:', selectedImageUri);

      setImageUri(selectedImageUri);
      
      // Update the navigation params to preserve the image
      navigation.setParams({
        combinedUserData: {
          ...combinedUserData,
          firstName,
          lastName,
          phone,
          biography,
          profilePic: selectedImageUri
        }
      });
      
      console.log('Image selected:', selectedImageUri);
    }
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'Failed to select image. Please try again.');
  }
};


  // Custom Profile Picture Component
  const CustomProfilePicture = () => (
    <View className="relative">
      {/* Main Profile Picture Circle */}
      <TouchableOpacity
        onPress={pickImage}
        className="relative"
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          overflow: 'hidden',
          borderWidth: 3,
          borderColor: Colors.uaBlue,
          backgroundColor: '#F3F4F6',
        }}
      >
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover"
          />
        ) : (
          <View 
            className="flex-1 items-center justify-center"
            style={{ backgroundColor: Colors.uaBlue + '20' }}
          >
            <Text className="text-gray-500 text-sm font-medium text-center">
              Tap to add{'\n'}photo
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Edit Button */}
      <TouchableOpacity
        onPress={pickImage}
        className="absolute -bottom-1 -right-1 rounded-full border-2 border-white shadow-lg"
        style={{
          backgroundColor: Colors.uaBlue,
          width: 36,
          height: 36,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <PencilIcon size={18} color="white" />
      </TouchableOpacity>
    </View>
  );

  const handleButtonPress = async () => {
    if (!firstName || !lastName || !email || !phone) {
      Alert.alert("Missing Information", "Please fill out all required fields before proceeding.");
      return;
    }
  
    try {

      // Prepare the complete user data for the backend
      const completeUserData = {
        firstName,
        lastName,
        email,
        phone,
        biography,
        location: combinedUserData?.location || userData?.location,
        skills: combinedUserData?.skills || [],
        firebaseId: userData?.firebaseId || '' 
      };

      console.log("Complete User Data for onboarding:", completeUserData);

      // Call the backend API first to get the complete user data with ID
      const response = await postUserOnboarding(completeUserData, imageUri);
      console.log("User Data response from backend:", response);
      // If backend returned the created user, normalize the response and set it into context
      try {
        if (response) {
          // Normalize backend response into the MemberData | CoachData shape expected by UserContext
          const normalize = (resp: any) => {
            // prefer provided keys, fallback to common alternatives
            const id = resp.id || resp.userId || resp.memberId || resp.coachId;
            const firebaseId = resp.firebaseId || resp.firebaseID || getFirebaseAuthSafe()?.currentUser?.uid || '';
            const email = resp.email || '';
            const firstName = resp.firstName || resp.first_name || '';
            const lastName = resp.lastName || resp.last_name || '';
            const phone = resp.phone || '';
            const location = resp.location || '';
            const profilePic = resp.profilePic || resp.profile_pic || resp.profile_image || resp.profile || '';
            const bioPic1 = resp.bioPic1 || resp.bio_pic1 || '';
            const bioPic2 = resp.bioPic2 || resp.bio_pic2 || '';
            const skills = resp.skills || resp.selectedSkills || [];
            const skillsWithLevels = resp.skillsWithLevels || resp.skills_with_levels || [];
            // Determine userType: use explicit field if present, otherwise infer from available coach fields
            const userType = (resp.userType || resp.user_type || (resp.biography1 || resp.bioPic1 || skillsWithLevels.length ? 'COACH' : 'MEMBER')).toUpperCase();

            if (userType === 'COACH') {
              return {
                id,
                firstName,
                lastName,
                email,
                phone,
                biography1: resp.biography1 || resp.biography || '',
                biography2: resp.biography2 || '',
                profilePic,
                bioPic1,
                bioPic2,
                location,
                firebaseId,
                userType: 'COACH',
                skills: resp.skills || [],
                skillsWithLevels: skillsWithLevels
              };
            }

            // Default to MEMBER shape
            return {
              id,
              firstName,
              lastName,
              email,
              phone,
              biography: resp.biography || '',
              profilePic,
              location,
              firebaseId,
              userType: 'MEMBER',
              skills: skills
            };
          };

          const mapped = normalize(response);
          console.log('About to set normalized user data into context:', mapped);
          await setUserData(mapped as any);

          // Re-fetch authoritative user record (contains signed profilePic URL) and update context
          try {
            const firebaseId = mapped.firebaseId || getFirebaseAuthSafe()?.currentUser?.uid || '';
            if (firebaseId) {
              try {
                const freshMember = await getMemberByFirebaseId(firebaseId);
                if (freshMember && freshMember.firstName) {
                  console.log('Refetched member after onboarding; updating context with authoritative record');
                  await setUserData(freshMember as any);
                } else {
                  // try coach
                  const freshCoach = await getCoachByFirebaseId(firebaseId);
                  if (freshCoach && freshCoach.firstName) {
                    console.log('Refetched coach after onboarding; updating context with authoritative record');
                    await setUserData(freshCoach as any);
                  }
                }
              } catch (refetchErr) {
                console.warn('Refetching authoritative user record failed:', refetchErr);
              }
            }
          } catch (err) {
            console.error('Error during post-onboarding re-fetch:', err);
          }

          console.log('Set normalized user data after onboarding');
          // Reset the navigation state at the root so the onboarding stack is replaced by the main app
          try {
            // Use the global navigationRef to reset the root to the MainTab -> Home
            const { resetRootToHomeTabWithRetry } = require('../../navigation/NavigationRef');
            await resetRootToHomeTabWithRetry(15, 150);
            // Also attempt navigating locally to the OnboardingStack's 'Home' route
            try {
              // @ts-ignore
              navigation.navigate('Home');
            } catch (navErr) {
              console.warn('Local navigation to Onboarding Home failed:', navErr);
            }
          } catch (navErr) {
            console.error('Global navigation reset failed, falling back to navigate:', navErr);
            try {
              // @ts-ignore
              navigation.navigate('Home');
            } catch (errNav) {
              console.error('Fallback navigation to Home also failed:', errNav);
            }
          }

        }
      } catch (err) {
        console.error('Error setting user data after onboarding:', err);
      }

    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert("Error", "Failed to complete onboarding. Please try again.");
    }
  };

  if (isWeb && isLargeScreen) {
    // Web Desktop Layout
    return (
      <View 
        className="flex-1 bg-gradient-to-br from-ua-red to-red-600"
        style={{ minHeight: height }}
      >
        <KeyboardAwareScrollView 
          enableOnAndroid={true} 
          extraScrollHeight={80} 
          extraHeight={120}
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: 32 
          }}
        >
          <View className="bg-white rounded-lg p-8 w-full max-w-4xl shadow-lg">
            {/* Header Section */}
            <View className="items-center mb-8">
              <LogoImageContainer />
              <HeaderText text="Thank you for Joining UA!" />
              <View className="w-16 h-1 bg-ua-red rounded-full mt-4"></View>
            </View>

            {/* Main Content Grid */}
            <View className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Left Column - Profile Picture */}
              <View className="flex items-center justify-start">
                <View className="mb-6">
                  <Text className="text-lg font-bold text-gray-900 mb-4 text-center">
                    Profile Picture
                  </Text>
                  <View className="items-center">
                    <CustomProfilePicture />
                  </View>
                  <Text className="text-sm text-gray-500 text-center mt-3">
                    {imageUri ? 'Tap to change photo' : 'Click to upload a photo'}
                  </Text>
                </View>
              </View>

              {/* Right Column - Form Fields */}
              <View className="space-y-4">
                <View>
                  <Text className="text-xl font-bold text-gray-900 mb-4">
                    Account Summary
                  </Text>
                </View>

                {/* Name Fields */}
                <View className="grid grid-cols-2 gap-4">
                  <View>
                    <Text className="text-gray-700 font-semibold mb-2">First Name *</Text>
                    <View className="w-full">
                      <EditTextField 
                        value={firstName} 
                        onChange={setFirstName}
                        placeholder="First Name"
                      />
                    </View>
                  </View>
                  <View>
                    <Text className="text-gray-700 font-semibold mb-2">Last Name *</Text>
                    <View className="w-full">
                      <EditTextField 
                        value={lastName} 
                        onChange={setLastName}
                        placeholder="Last Name"
                      />
                    </View>
                  </View>
                </View>

                {/* Email Field */}
                <View>
                  <Text className="text-gray-700 font-semibold mb-2">Email *</Text>
                  <View className="w-full">
                    <EditEmailField 
                      value={email} 
                      onChange={setEmail}
                      placeholder="your.email@example.com"
                    />
                  </View>
                </View>

                {/* Phone Field */}
                <View>
                  <Text className="text-gray-700 font-semibold mb-2">Phone *</Text>
                  <View className="w-full">
                    <EditPhoneField 
                      value={phone} 
                      onChange={setPhone}
                      placeholder="(555) 123-4567"
                    />
                  </View>
                </View>

                {/* Bio Field */}
                <View>
                  <Text className="text-gray-700 font-semibold mb-2">Bio</Text>
                  <View className="w-full">
                    <EditBioField 
                      value={biography} 
                      onChange={setBiography}
                      placeholder="Tell us about yourself..."
                    />
                  </View>
                </View>

                {/* Skills Summary */}
                {combinedUserData?.skills && combinedUserData.skills.length > 0 && (
                  <View>
                    <Text className="text-gray-700 font-semibold mb-2">Selected Skills</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {combinedUserData.skills.map((skill: { skill_id: React.Key | null | undefined; title: string; }) => (
                        <View 
                          key={skill.skill_id}
                          className="bg-ua-blue px-3 py-1 rounded-full"
                        >
                          <Text className="text-white text-sm font-medium">
                            {skill.title.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Action Button */}
            <View className="flex items-center mb-6">
              <View className="w-full max-w-sm">
                <PrimaryButton title="Get Started" onPress={handleButtonPress} />
              </View>
            </View>

            {/* Progress Indicator */}
            <View className="flex-row justify-center items-center space-x-2">
              <View className="w-3 h-3 bg-ua-green rounded-full"></View>
              <View className="w-3 h-3 bg-ua-blue rounded-full"></View>
              <View className="w-3 h-3 bg-ua-red rounded-full"></View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }

  // Mobile Layout (Original)
  return (
    <View className="flex-1 items-center bg-white p-4">
      <LogoImageContainer />
      <HeaderText text="Thank you for Joining UA!" />
      <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={80} extraHeight={120}>
        <View className="flex-row items-center justify-between w-full">
          <CustomProfilePicture />
          <View className="mt-8 px-6">
            <SubHeaderText1 text="Account Summary" />
            <View className="flex-row items-start">
              <View className="pr-1">
                <SmallText text="First" />
              </View>
              <EditTextField value={firstName} onChange={setFirstName} />
            </View>
            <View className="flex-row items-start">
              <View className="pr-1">
                <SmallText text="Last" />
              </View>
              <EditTextField value={lastName} onChange={setLastName} />
            </View>
          </View>
        </View>

        <View className="flex-2 justify-start">
          <View className="flex-row items-start">
            <View className="pr-1">
              <SmallText text="Email" />
            </View>
            <EditEmailField value={email} onChange={setEmail} />
          </View>

          <View className="flex-row items-start">
            <View className="pr-1">
              <SmallText text="Phone" />
            </View>
            <EditPhoneField value={phone} onChange={setPhone} />
          </View>

          <View className="flex-row items-start">
            <View className="pr-1">
              <SmallText text="Bio" />
            </View>
            <EditBioField value={biography} onChange={setBiography} />
          </View>

          {/* Skills Summary for Mobile */}
          {combinedUserData?.skills && combinedUserData.skills.length > 0 && (
            <View className="mt-4">
              <SmallText text="Skills" />
              <View className="flex-row flex-wrap mt-2">
                {combinedUserData.skills.map((skill: { skill_id: React.Key | null | undefined; title: string; }) => (
                  <View 
                    key={skill.skill_id}
                    className="bg-blue-100 px-2 py-1 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-blue-800 text-xs">
                      {skill.title.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      <View>
          <PrimaryButton title="Get Started" onPress={handleButtonPress} />
      </View>
    </View>
  );
};

export default AccountSummary;

