import { View, Text, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import * as Location from 'expo-location'

    const UserLocation = () => {
        const [location, setLocation] = useState<Location.LocationObject | null>(null)

        const requestLocationPermission = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync()
            if (status !== 'granted') {
                Alert.alert('Permission to access location was denied')
                return
            }

            let location = await Location.getCurrentPositionAsync({})
            setLocation(location)
        }

        return (
            <View>
                <Text>UserLocation</Text>
                <Button title="Grant Location Access" onPress={requestLocationPermission} />
                {location && (
                    <Text>Location: {JSON.stringify(location)}</Text>
                )}
            </View>
        )
    }

    export default UserLocation
