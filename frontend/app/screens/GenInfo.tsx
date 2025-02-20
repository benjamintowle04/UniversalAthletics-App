import { View, Text, Alert, TextInput, Image } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import * as Location from 'expo-location';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import "../../global.css";
import { HeaderText } from '../components/text/HeaderText';
import { RouterProps } from '../types/RouterProps';


const GenInfo = ({ navigation }: RouterProps) => {
    const [location, setLocation] = useState<string | null>(null);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const userContext = useContext(UserContext);

    if (!userContext) {
        Alert.alert('Error loading User Data');
        return null; 
    }

    const moveToEnterSkills = () => {
        //handleSave();   Uncomment this line before pushing
        navigation.navigate("EnterSkills");
        console.log("Moving to Enter Skills");
    } 

    const { userData, setUserData } = userContext;

    useEffect(() => {
        const requestLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied');
                setLocation("");
                setUserData({ ...userData, location: ""});
                console.log("Location permission denied");
            } else {
                let location = await Location.getCurrentPositionAsync({});
                let locationString = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
                setLocation(locationString);
                setUserData({ ...userData, location: locationString});
                console.log("Location permission granted");
                console.log("Location string:", locationString);
                console.log("Updated userData:", { ...userData, location: locationString });
            }
        };
        requestLocationPermission();
    }, []);

    // const handleSave = () => {
    //     setUserData({ ...userData, firstName, lastName, phoneNumber, bio, location});
    // };

    return (
        <View className="flex-1 justify-center items-center p-4 bg-white">
            <Image
                source={require('../images/logo.png')}
                className="w-48 h-48 mb-6"
                resizeMode="contain"
            />
            <HeaderText text="Tell Us About Yourself"/>
            <TextInput
                value={firstName}
                className="h-10 border border-gray-400 mb-3 px-2 w-4/5"
                placeholder="First Name"
                onChangeText={(text) => setFirstName(text)}
            />
            <TextInput
                value={lastName}
                className="h-10 border border-gray-400 mb-3 px-2 w-4/5"
                placeholder="Last Name"
                onChangeText={(text) => setLastName(text)}
            />
            <TextInput
                value={phoneNumber}
                className="h-10 border border-gray-400 mb-3 px-2 w-4/5"
                placeholder="Phone Number"
                keyboardType="phone-pad"
                onChangeText={(text) => setPhoneNumber(text)}
            />
            <TextInput
                value={bio}
                className="h-24 border border-gray-400 mb-3 px-2 w-4/5"
                placeholder="Tell us about yourself"
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setBio(text)}
            />
            <View>
                <PrimaryButton title="Continue" onPress={moveToEnterSkills} />
            </View>
        </View>
    );
};

export default GenInfo;