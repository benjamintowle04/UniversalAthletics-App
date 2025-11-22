import { View, Image, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { RouterProps } from '../../types/RouterProps';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { useUser } from '../../contexts/UserContext';
import { HeaderText } from '../../components/text/HeaderText';
import "../../../global.css";
import { LogoImageContainer } from '../../components/image_holders/LogoImageContainer';
import { Platform } from 'react-native';
import { resetRootToHomeTabWithRetry } from '../../navigation/NavigationRef';

const EntryPoint = ({ navigation }: RouterProps) => {
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  const moveToLogin = () => {
    navigation.navigate("Login");
    console.log("Moving to Login");
  };

  const moveToSignUp = () => {
    navigation.navigate("SignUp");
    console.log("Moving to Sign Up");
  };

  const { continueAsGuest } = useUser();

  const continueGuest = () => {
    continueAsGuest();
    // Rely on the app's conditional rendering (AppNavigator uses isGuest)
    // to show the main tabs automatically. Avoid direct navigation to a
    // top-level nested route from within the PreLogin stack (which triggers
    // the 'not handled by any navigator' warning).
    console.log('Continuing as guest; attempting root reset to HomeTab');
    // Try to aggressively reset the root to the Home tab so navigation state
    // transitions immediately and the user sees the main app.
    resetRootToHomeTabWithRetry().catch(err => {
      console.warn('Failed to reset root to HomeTab:', err);
    });
  };

  if (isWeb && isLargeScreen) {
    // Web Desktop Layout
    return (
      <ScrollView 
        className="flex-1 bg-white"
      >
        <View className="flex-1 lg:flex-row">
          {/* Left Side - Hero Section */}
          <View className="lg:w-1/2 flex-1 justify-center items-center p-8 lg:p-16">
            <View className="max-w-md w-full">
              <LogoImageContainer />
              <HeaderText text='Welcome to Universal Athletics' />
              <View className="mt-8 space-y-4">
                <View className="mb-4">
                  <PrimaryButton title="Login" onPress={moveToLogin} />
                </View>
                <PrimaryButton title="Sign Up" onPress={moveToSignUp} />
                <View className="mt-4">
                  <PrimaryButton title="Continue as Guest" onPress={continueGuest} />
                </View>
              </View>
            </View>
          </View>

          {/* Right Side - Feature Showcase */}
          <View className="lg:w-1/2 bg-ua-blue flex-1 justify-center items-center p-8 lg:p-16">
            <View className="max-w-md w-full text-center">
              <View className="mb-8">
                <View className="mb-12">
                  <HeaderText   
                    text="Connect with Coaches" 
                    style={{ color: 'white', fontSize: 32, marginBottom: 16 }}
                  />
                </View>
                <View className="space-y-4">
                  <FeatureItem 
                    icon="🏃‍♂️" 
                    title="Find Expert Coaches" 
                    description="Find and connect with coaches in your area"
                  />
                  <View className="mb-6">
                    <FeatureItem
                      icon="📅" 
                      title="Schedule Sessions" 
                      description="Book training sessions that fit your schedule"
                    />
                  </View>
                  <FeatureItem
                    icon="🤝" 
                    title="Building Strong Communities Together" 
                    description="Join Group Events catered for all needs and skill levels"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Mobile/Tablet Layout (your original design)
  return (
    <View className="flex-1 justify-center items-center bg-white px-4">
      <LogoImageContainer />
      <HeaderText text='Welcome to UA' />
      
      <View className="w-full max-w-sm mt-8 space-y-4">
        <View className="mb-4">
          <PrimaryButton title="Login" onPress={moveToLogin} />
        </View>
        <PrimaryButton title="Sign Up" onPress={moveToSignUp} />
        <View className="mt-4">
          <PrimaryButton title="Continue as Guest" onPress={continueGuest} />
        </View>
      </View>
    </View>
  );
};

// Helper component for web features
const FeatureItem = ({ icon, title, description }: {
  icon: string;
  title: string;
  description: string;
}) => (
  <View className="flex-row items-center mb-6">
    <View className="text-4xl mr-4">
      <HeaderText text={icon} style={{ fontSize: 24 }} />
    </View>
    <View className="flex-1">
      <HeaderText 
        text={title} 
        style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}
      />
      <HeaderText 
        text={description} 
        style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}
      />
    </View>
  </View>
);

export default EntryPoint;
