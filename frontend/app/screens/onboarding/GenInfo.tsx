import { View, Text, Alert, TextInput, Image, Dimensions, Platform, TouchableOpacity } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as Location from 'expo-location';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import { Ionicons } from '@expo/vector-icons';
import "../../../global.css";
import { HeaderText } from '../../components/text/HeaderText';
import { RouterProps } from '../../types/RouterProps';
import { LogoImageContainer } from '../../components/image_holders/LogoImageContainer';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors } from '../../themes/colors/Colors';
import { FIREBASE_AUTH } from '../../../firebase_config';

const GenInfo = ({ navigation }: RouterProps) => {
    const { width, height } = Dimensions.get('window');
    const isWeb = Platform.OS === 'web';
    const isLargeScreen = width > 768;

    const userContext = useContext(UserContext);
    if (!userContext) {
        Alert.alert("Error Fetching User Context");
        return null;
    }

    const { userData, setUserData } = userContext;

    const [firstName, setFirstName] = useState<string>(userData?.firstName || '');
    const [lastName, setLastName] = useState<string>(userData?.lastName || '');
    const [biography, setBiography] = useState<string>(userData?.biography || '');
    const [location, setLocation] = useState<string>(userData?.location || '');
    const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);

    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [bioError, setBioError] = useState<string | null>(null);
    const auth = FIREBASE_AUTH;

    // Function to format phone number as (XXX) XXX-XXXX
    const formatPhoneNumber = (input: string) => {
        const digits = input.replace(/\D/g, ""); 
        let formatted = "";

        if (digits.length > 0) {
            formatted = `(${digits.slice(0, 3)}`;
        }
        if (digits.length >= 4) {
            formatted += `) ${digits.slice(3, 6)}`;
        }
        if (digits.length >= 7) {
            formatted += `-${digits.slice(6, 10)}`;
        }

        return formatted;
    };

    const [phone, setPhone] = useState<string>(formatPhoneNumber(userData?.phone || ''));

    // Function to get user's current location (mobile only)
    const getCurrentLocation = async () => {
        if (isWeb) {
            Alert.alert("Location Services", "Please enter your location manually on web.");
            return;
        }

        setIsGettingLocation(true);
        try {
            console.log("Requesting location permission...");
            let { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied', 
                    'Location permission is required to get your current location. You can still enter your location manually.',
                    [{ text: 'OK' }]
                );
                setIsGettingLocation(false);
                return;
            }

            console.log("Getting current position...");
            let locationResult = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            // Reverse geocode to get readable address
            let reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: locationResult.coords.latitude,
                longitude: locationResult.coords.longitude,
            });

            if (reverseGeocode.length > 0) {
                const address = reverseGeocode[0];
                const formattedLocation = `${address.city || ''}, ${address.region || ''} ${address.postalCode || ''}`.trim();
                setLocation(formattedLocation || `${address.city || ''}, ${address.region || ''}`);
                console.log("Location set:", formattedLocation);
            } else {
                // Fallback to coordinates if reverse geocoding fails
                const coordsLocation = `${locationResult.coords.latitude.toFixed(4)}, ${locationResult.coords.longitude.toFixed(4)}`;
                setLocation(coordsLocation);
                console.log("Using coordinates:", coordsLocation);
            }

        } catch (error) {
            console.error("Error getting location:", error);
            Alert.alert(
                'Location Error', 
                'Unable to get your current location. Please enter your location manually.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsGettingLocation(false);
        }
    };

    // Function to handle phone number input
    const handlePhoneNumberChange = (text: string) => {
        const formatted = formatPhoneNumber(text);
        setPhone(formatted);

        const onlyNumbers = text.replace(/\D/g, "");
        if (onlyNumbers.length < 10) {
            setPhoneError("Phone number must be at least 10 digits.");
        } else {
            setPhoneError(null);
        }
    };

    const validateBio = (text: string) => {
        const words = text.trim().split(/\s+/);
        if (words.length > 200) {
            setBioError("Bio cannot exceed 200 words.");
        } else {
            setBiography(text);
            setBioError(null);
        }
    };

    const moveToEnterSkills = () => {
        if (!firstName || !lastName || !phone || !location) {
            Alert.alert("Missing Information", "Please fill out all required fields before proceeding.");
            return;
        }
          
        if (phoneError || bioError) {
            Alert.alert("Please fix the errors before proceeding.");
            return;
        }

        // Pass the user data to the next screen
        const userDataToPass = {
            firstName,
            lastName,
            phone,
            biography,
            location
        };

        navigation.navigate("EnterSkills", { 
            userData: userDataToPass 
        });
    };

    // Location input component for reuse
    const LocationInput = ({ isWebLayout = false }) => (
        <View style={isWebLayout ? {} : { width: '80%' }}>
            {isWebLayout && (
                <Text className="text-gray-700 font-semibold mb-2">Location *</Text>
            )}
            <View className={`flex-row items-center border border-gray-300 rounded-lg ${isWebLayout ? 'h-12 px-4' : 'h-10 px-2 mb-3'} bg-white`}>
                <Ionicons name="location-outline" size={20} color={Colors.uaBlue} />
                <TextInput
                    value={location}
                    className={`flex-1 ml-2 ${isWebLayout ? 'text-gray-900' : 'text-gray-900'}`}
                    placeholder="Enter your city, state"
                    onChangeText={setLocation}
                    returnKeyType="done"
                />
                {!isWeb && (
                    <TouchableOpacity
                        onPress={getCurrentLocation}
                        disabled={isGettingLocation}
                        className="ml-2 p-1"
                    >
                        <Ionicons 
                            name={isGettingLocation ? "refresh" : "navigate"} 
                            size={20} 
                            color={isGettingLocation ? Colors.grey.medium : Colors.uaGreen}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {!isWeb && (
                <Text className="text-gray-500 text-xs mb-3 px-2">
                    Tap the navigation icon to use your current location
                </Text>
            )}
        </View>
    );

    if (isWeb && isLargeScreen) {
        // Web Desktop Layout
        return (
            <KeyboardAwareScrollView 
                className="flex-1 bg-gradient-to-br from-ua-green to-green-600"
                enableOnAndroid={true} 
                extraScrollHeight={80} 
                extraHeight={120}
                contentContainerStyle={{ minHeight: height }}
            >
                <View className="flex-1 justify-center items-center p-8">
                    <View className="bg-white rounded-lg p-8 w-full max-w-2xl shadow-lg">
                        {/* Header Section */}
                        <View className="items-center mb-8">
                            <Image
                                source={require('../../images/logo.png')}
                                style={{ width: 64, height: 64, marginBottom: 16 }}
                                resizeMode="contain"
                            />
                            <HeaderText text="Tell Us About Yourself" />
                            <View className="w-16 h-1 bg-ua-green rounded-full mt-4"></View>
                        </View>

                        {/* Form Fields */}
                        <View className="space-y-6 mb-8">
                            {/* Name Fields Row */}
                            <View className="grid grid-cols-2 gap-4">
                                <View>
                                    <Text className="text-gray-700 font-semibold mb-2">First Name *</Text>
                                    <TextInput 
                                        value={firstName}
                                        className="h-12 border border-gray-300 px-4 w-full rounded-lg text-gray-900"
                                        placeholder="First Name"
                                        onChangeText={setFirstName}
                                        returnKeyType="done"
                                    />
                                </View>
                                <View>
                                    <Text className="text-gray-700 font-semibold mb-2">Last Name *</Text>
                                    <TextInput
                                        value={lastName}
                                        className="h-12 border border-gray-300 px-4 w-full rounded-lg text-gray-900"
                                        placeholder="Last Name"
                                        onChangeText={setLastName}
                                        returnKeyType="done"
                                    />
                                </View>
                            </View>

                            {/* Phone Field */}
                            <View>
                                <Text className="text-gray-700 font-semibold mb-2">Phone Number *</Text>
                                <TextInput
                                    value={phone}
                                    className="h-12 border border-gray-300 px-4 w-full rounded-lg text-gray-900"
                                    placeholder="Phone Number"
                                    keyboardType="phone-pad"
                                    onChangeText={handlePhoneNumberChange}
                                    returnKeyType="done"
                                    maxLength={14}
                                />
                                {phoneError && (
                                    <Text className="text-red-500 text-sm mt-1">{phoneError}</Text>
                                )}
                            </View>

                            {/* Location Field */}
                            <View>
                                <LocationInput isWebLayout={true} />
                            </View>

                            {/* Bio Field */}
                            <View>
                                <Text className="text-gray-700 font-semibold mb-2">Bio (Optional)</Text>
                                <TextInput
                                    value={biography}
                                    className="h-32 border border-gray-300 px-4 py-3 w-full rounded-lg text-gray-900"
                                    placeholder="Tell us about yourself..."
                                    multiline={true}
                                    numberOfLines={6}
                                    onChangeText={validateBio}
                                    returnKeyType="done"
                                    textAlignVertical="top"
                                />
                                {bioError && (
                                    <Text className="text-red-500 text-sm mt-1">{bioError}</Text>
                                )}
                                <Text className="text-gray-500 text-sm mt-1">
                                    Maximum 200 words
                                </Text>
                            </View>
                        </View>

                        {/* Continue Button */}
                        <View className="items-center mb-6">
                            <View className="w-full max-w-sm">
                                <PrimaryButton title="Continue" onPress={moveToEnterSkills} />
                            </View>
                        </View>

                        {/* Progress Indicator */}
                        <View className="flex-row justify-center items-center space-x-2">
                            <View className="w-3 h-3 bg-ua-green rounded-full"></View>
                            <View className="w-3 h-3 bg-gray-300 rounded-full"></View>
                            <View className="w-3 h-3 bg-gray-300 rounded-full"></View>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        );
    }

    // Mobile Layout
    return (
        <KeyboardAwareScrollView className="bg-white" enableOnAndroid={true} extraScrollHeight={80} extraHeight={120}>
            <View className="flex-1 justify-center items-center p-4 bg-white">
                <LogoImageContainer />
                <View className="w-full">
                    <HeaderText text="Tell Us About Yourself" />
                </View>
                
                <TextInput 
                    value={firstName}
                    className="h-10 border border-gray-400 mb-3 px-2 w-4/5 rounded-md"
                    placeholder="First Name"
                    onChangeText={setFirstName}
                    returnKeyType="done"
                />
                
                <TextInput
                    value={lastName}
                    className="h-10 border border-gray-400 mb-3 px-2 w-4/5 rounded-md"
                    placeholder="Last Name"
                    onChangeText={setLastName}
                    returnKeyType="done"
                />
                
                <TextInput
                    value={phone}
                    className="h-10 border border-gray-400 mb-3 px-2 w-4/5 rounded-md"
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    onChangeText={handlePhoneNumberChange}
                    returnKeyType="done"
                    maxLength={14}
                />
                {phoneError && <Text className="text-red-500 mb-3">{phoneError}</Text>}

                <LocationInput />

                <TextInput
                    value={biography}
                    className="h-24 border border-gray-400 mb-3 px-2 w-4/5 rounded-md"
                    placeholder="Bio (Optional)"
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={validateBio}
                    returnKeyType="done"
                />
                {bioError && <Text className="text-red-500 mb-3">{bioError}</Text>}

                <View>
                    <PrimaryButton title="Continue" onPress={moveToEnterSkills} />
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default GenInfo;
