import { View, Text, Alert, TextInput, Image, Dimensions, Platform } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/UserContext';
import * as Location from 'expo-location';
import { PrimaryButton } from '../../components/buttons/PrimaryButton';
import "../../../global.css";
import { HeaderText } from '../../components/text/HeaderText';
import { RouterProps } from '../../types/RouterProps';
import { LogoImageContainer } from '../../components/image_holders/LogoImageContainer';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
    const [location, setLocation] = useState<string | null>(userData?.location || null);

    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [bioError, setBioError] = useState<string | null>(null);

    useEffect(() => {
        const requestLocationPermission = async () => {
            console.log("requesting location permission. User Data: ", userData);
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                setLocation("");
                // Don't set userData here - save for the end
            } else {
                let location = await Location.getCurrentPositionAsync({});
                let locationString = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
                setLocation(locationString);
                // Don't set userData here - save for the end
            }

            console.log("Requested location permission. User Data: ", userData);
        };
        requestLocationPermission();
    }, []);

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

    //Need to set the hook after the function is declared
    const [phone, setPhone] = useState<string>(formatPhoneNumber(userData?.phone || ''));

    // Function to handle phone number input
    const handlePhoneNumberChange = (text: string) => {
        const formatted = formatPhoneNumber(text);
        setPhone(formatted);

        const onlyNumbers = text.replace(/\D/g, ""); // Extract only digits
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

    const handleSave = () => {
        if (!firstName || !lastName || !phone) {
            Alert.alert("Missing Information", "Please fill out all required fields before proceeding.");
            return false;
        }
          
        if (phoneError || bioError) {
            Alert.alert("Please fix the errors before proceeding.");
            return false;
        }

        // Store data temporarily - don't call setUserData yet
        // We'll collect all data and set it at the end in AccountSummary
        return true;
    };

    const moveToEnterSkills = () => {
        if (handleSave() && !phoneError && !bioError) {
            // Store the form data in a temporary object that we'll pass through navigation
            const tempUserData = {
                firstName,
                lastName,
                phone: phone.replace(/\D/g, ""), // Store clean phone number
                biography,
                location
            };
            
            console.log("Temporary User Data from GenInfo: ", tempUserData);
            navigation.navigate("EnterSkills", { tempUserData });
        }
    };

    if (isWeb && isLargeScreen) {
        // Web Desktop Layout
        return (
            <View 
                className="flex-1 bg-gradient-to-br from-ua-green to-green-600"
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
                    <View className="bg-white rounded-lg p-8 w-full max-w-lg shadow-lg">
                        {/* Header Section */}
                        <View className="items-center mb-8">
                            <Image
                                source={require('../../images/logo.png')}
                                style={{ width: 64, height: 64, marginBottom: 16 }} // Use inline styles instead of className
                                resizeMode="contain"
                            />
                            <HeaderText text="Tell Us About Yourself" />
                            <View className="w-16 h-1 bg-ua-green rounded-full mt-4"></View>
                        </View>

                        {/* Form Fields */}
                        <View className="space-y-4 mb-8">
                            <View>
                                <Text className="text-gray-700 font-semibold mb-2">First Name *</Text>
                                <TextInput 
                                    value={firstName}
                                    className="border border-gray-300 rounded-lg p-4 text-base"
                                    placeholder="Enter your first name"
                                    onChangeText={setFirstName}
                                    returnKeyType="next"
                                />
                            </View>

                            <View>
                                <Text className="text-gray-700 font-semibold mb-2">Last Name *</Text>
                                <TextInput
                                    value={lastName}
                                    className="border border-gray-300 rounded-lg p-4 text-base"
                                    placeholder="Enter your last name"
                                    onChangeText={setLastName}
                                    returnKeyType="next"
                                />
                            </View>

                            <View>
                                <Text className="text-gray-700 font-semibold mb-2">Phone Number *</Text>
                                <TextInput
                                    value={phone}
                                    className="border border-gray-300 rounded-lg p-4 text-base"
                                    placeholder="(555) 123-4567"
                                    keyboardType="phone-pad"
                                    onChangeText={handlePhoneNumberChange}
                                    returnKeyType="next"
                                    maxLength={14}
                                />
                                {phoneError && <Text className="text-red-500 text-sm mt-1">{phoneError}</Text>}
                            </View>

                            <View>
                                <Text className="text-gray-700 font-semibold mb-2">Bio (Optional)</Text>
                                <TextInput
                                    value={biography}
                                    className="border border-gray-300 rounded-lg p-4 text-base"
                                    style={{ minHeight: 100, textAlignVertical: 'top' }}
                                    placeholder="Tell us a bit about yourself and your athletic goals..."
                                    multiline={true}
                                    numberOfLines={4}
                                    onChangeText={validateBio}
                                    returnKeyType="done"
                                />
                                {bioError && <Text className="text-red-500 text-sm mt-1">{bioError}</Text>}
                                <Text className="text-gray-500 text-sm mt-1">Maximum 200 words</Text>
                            </View>
                        </View>

                        {/* Continue Button */}
                        <View className="mb-6">
                            <PrimaryButton title="Continue" onPress={moveToEnterSkills} />
                        </View>

                        {/* Progress Indicator */}
                        <View className="flex-row justify-center items-center space-x-2">
                            <View className="w-3 h-3 bg-ua-green rounded-full"></View>
                            <View className="w-3 h-3 bg-gray-300 rounded-full"></View>
                            <View className="w-3 h-3 bg-gray-300 rounded-full"></View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }

    // Mobile Layout (Original)
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
                {phoneError && <Text className="text-red-500">{phoneError}</Text>}

                <TextInput
                    value={biography}
                    className="h-24 border border-gray-400 mb-3 px-2 w-4/5 rounded-md"
                    placeholder="Bio"
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={validateBio}
                    returnKeyType="done"
                />
                {bioError && <Text className="text-red-500">{bioError}</Text>}

                <View>
                    <PrimaryButton title="Continue" onPress={moveToEnterSkills} />
                </View>
            </View>
        </KeyboardAwareScrollView>
    );
};

export default GenInfo;
