import { View, Text, Alert, TextInput, Image } from 'react-native';
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
    const userContext = useContext(UserContext);
    if (!userContext) {
        Alert.alert("Error Fetching User Context");
        return null;
    }

    const { userData, setUserData } = userContext;

    const [firstName, setFirstName] = useState<string>(userData.firstName || '');
    const [lastName, setLastName] = useState<string>(userData.lastName || '');
    const [bio, setBio] = useState<string>(userData.bio || '');
    const [location, setLocation] = useState<string | null>(userData.location || null);

    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [bioError, setBioError] = useState<string | null>(null);

    
    useEffect(() => {
        const requestLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                setLocation("");
                setUserData({ ...userData, location: ""});
            } else {
                let location = await Location.getCurrentPositionAsync({});
                let locationString = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
                setLocation(locationString);
                setUserData({ ...userData, location: locationString});
            }
        };
        requestLocationPermission();
    }, []);


    // Function to format phone number as (XXX) XXX-XXXX
    const formatPhoneNumber = (input: string) => {
        const digits = input.replace(/\D/g, ""); // Remove non-numeric characters
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
    const [phoneNumber, setPhoneNumber] = useState<string>(formatPhoneNumber(userData.phoneNumber || ''));


    // Function to handle phone number input
    const handlePhoneNumberChange = (text: string) => {
        const formatted = formatPhoneNumber(text);
        setPhoneNumber(formatted);

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
            setBio(text);
            setBioError(null);
        }
    };

    const handleSave = () => {
        if (!firstName || !lastName || !phoneNumber) {
            Alert.alert("Missing Information", "Please fill out all required fields before proceeding.");
            return false;
          }
          
        if (phoneError || bioError) {
            Alert.alert("Please fix the errors before proceeding.");
            return false;
        }
        try {
            setUserData({ ...userData, firstName, lastName, phoneNumber, bio, location });
            return true;
        } catch (error) {
            Alert.alert("Error Saving User Data");
        }
    };

    const moveToEnterSkills = () => {
        if (handleSave() && !phoneError && !bioError) {
            console.log("User Data Saved: ", userData)
            navigation.navigate("EnterSkills");
        }
    };

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
                    value={phoneNumber}
                    className="h-10 border border-gray-400 mb-3 px-2 w-4/5 rounded-md"
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    onChangeText={handlePhoneNumberChange}
                    returnKeyType="done"
                    maxLength={14} // Prevents exceeding (XXX) XXX-XXXX format
                />
                {phoneError && <Text className="text-red-500">{phoneError}</Text>}

                <TextInput
                    value={bio}
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
