import { View, Text, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useUser } from '../../contexts/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../themes/colors/Colors'
import { createMemberToCoachSessionRequest, createCoachToMemberSessionRequest } from '../../../controllers/SessionRequestController'
import "../../../global.css"
import { RouterProps } from "../../types/RouterProps"
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform } from 'react-native'
import { getUnsignedUrl } from '../../../utils/UnsignUrls'
import { FIREBASE_AUTH } from '../../../firebase_config'

interface RequestASessionProps {
  navigation: any;
  route: {
    params: {
      recipientId: number;
      recipientFirstName: string;
      recipientLastName: string;
      recipientProfilePic?: string;
      recipientFirebaseId: string; 
      recipientType: 'coach' | 'member'; 
    }
  }
}
const RequestASession = ({navigation, route}: RequestASessionProps) => {
  const { userData, updateUserData } = useUser()
  const [processing, setProcessing] = useState(false)
  // For fetching the firebase Id of the sender
  const auth = FIREBASE_AUTH;
  
  
  // Form state
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  
  // Date/Time state for 3 options
  const [dateTime1, setDateTime1] = useState({
    date: new Date(),
    time: new Date(),
    showDatePicker: false,
    showTimePicker: false
  })
  const [dateTime2, setDateTime2] = useState({
    date: new Date(),
    time: new Date(),
    showDatePicker: false,
    showTimePicker: false
  })
  const [dateTime3, setDateTime3] = useState({
    date: new Date(),
    time: new Date(),
    showDatePicker: false,
    showTimePicker: false
  })

  const { recipientId, recipientFirstName, recipientLastName, recipientProfilePic, recipientType, recipientFirebaseId} = route.params

  // Helper function to convert 24hr time to 12hr format
  const formatTimeTo12Hour = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

const formatDateForAPI = (date: Date) => {
  // Ensure YYYY-MM-DD format
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const formatTimeForAPI = (date: Date) => {
  // Ensure HH:MM:SS format (backend expects LocalTime which needs seconds)
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = '00'; // Add seconds
  return `${hours}:${minutes}:${seconds}`;
}

  const handleDateChange = (option: number, event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (option === 1) {
        setDateTime1(prev => ({ ...prev, date: selectedDate, showDatePicker: false }))
      } else if (option === 2) {
        setDateTime2(prev => ({ ...prev, date: selectedDate, showDatePicker: false }))
      } else if (option === 3) {
        setDateTime3(prev => ({ ...prev, date: selectedDate, showDatePicker: false }))
      }
    } else {
      // User cancelled
      if (option === 1) {
        setDateTime1(prev => ({ ...prev, showDatePicker: false }))
      } else if (option === 2) {
        setDateTime2(prev => ({ ...prev, showDatePicker: false }))
      } else if (option === 3) {
        setDateTime3(prev => ({ ...prev, showDatePicker: false }))
      }
    }
  }

  const handleTimeChange = (option: number, event: any, selectedTime?: Date) => {
    if (selectedTime) {
      if (option === 1) {
        setDateTime1(prev => ({ ...prev, time: selectedTime, showTimePicker: false }))
      } else if (option === 2) {
        setDateTime2(prev => ({ ...prev, time: selectedTime, showTimePicker: false }))
      } else if (option === 3) {
        setDateTime3(prev => ({ ...prev, time: selectedTime, showTimePicker: false }))
      }
    } else {
      // User cancelled
      if (option === 1) {
        setDateTime1(prev => ({ ...prev, showTimePicker: false }))
      } else if (option === 2) {
        setDateTime2(prev => ({ ...prev, showTimePicker: false }))
      } else if (option === 3) {
        setDateTime3(prev => ({ ...prev, showTimePicker: false }))
      }
    }
  }

  const validateForm = () => {
    if (!description.trim()) {
      Alert.alert("Missing Information", "Please provide a session description.")
      return false
    }
    if (!location.trim()) {
      Alert.alert("Missing Information", "Please provide a session location.")
      return false
    }
    return true
  }



const handleSendRequest = async () => {
  if (!userData) return

  if (!validateForm()) return

  setProcessing(true)

  try {
    console.log("Sender's firebase ID:", auth.currentUser?.uid); // Debug log
    const sessionRequestData = {
      senderType: 'MEMBER',
      senderId: userData.id,
      senderFirebaseId: auth.currentUser?.uid || '', 
      senderFirstName: userData.firstName,
      senderLastName: userData.lastName,
      senderProfilePic: getUnsignedUrl(userData.profilePic),
      receiverType: recipientType.toUpperCase(), // Add receiverType and ensure uppercase
      receiverId: recipientId,
      receiverFirebaseId: recipientFirebaseId,
      receiverFirstName: recipientFirstName,
      receiverLastName: recipientLastName,
      receiverProfilePic: getUnsignedUrl(recipientProfilePic),
      message: description,
      sessionDescription: description,
      sessionLocation: location,
      sessionDate1: formatDateForAPI(dateTime1.date),
      sessionTime1: formatTimeForAPI(dateTime1.time),
      sessionDate2: formatDateForAPI(dateTime2.date),
      sessionTime2: formatTimeForAPI(dateTime2.time),
      sessionDate3: formatDateForAPI(dateTime3.date),
      sessionTime3: formatTimeForAPI(dateTime3.time),
    }


    let response
    if (recipientType === 'coach') {
      response = await createMemberToCoachSessionRequest(sessionRequestData)
    } else {
      response = await createCoachToMemberSessionRequest(sessionRequestData)
    }

    console.log("Session request created successfully:", response)

    // Update the user context with the new sent session request
    const newSentRequest = {
      id: response.id, // Assuming the API returns the created request with an ID
      senderType: 'MEMBER' as const,
      senderId: userData.id,
      senderFirebaseId: auth.currentUser?.uid || '',
      receiverType: recipientType.toUpperCase() as 'COACH' | 'MEMBER',
      receiverId: recipientId,
      receiverFirebaseId: recipientFirebaseId,
      status: 'PENDING' as const,
      message: description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      senderFirstName: userData.firstName,
      senderLastName: userData.lastName,
      senderProfilePic: userData.profilePic ? userData.profilePic : '',
      receiverFirstName: recipientFirstName,
      receiverLastName: recipientLastName,
      receiverProfilePic: recipientProfilePic ? recipientProfilePic : '',
      sessionDate1: formatDateForAPI(dateTime1.date),
      sessionDate2: formatDateForAPI(dateTime2.date),
      sessionDate3: formatDateForAPI(dateTime3.date),
      sessionTime1: formatTimeForAPI(dateTime1.time),
      sessionTime2: formatTimeForAPI(dateTime2.time),
      sessionTime3: formatTimeForAPI(dateTime3.time),
      sessionLocation: location,
      sessionDescription: description,
    }

    // Add the new request to the existing sent requests
    updateUserData({
      sentSessionRequests: [...userData.sentSessionRequests, newSentRequest]
    })

    Alert.alert(
      "Request Sent!", 
      `Your session request has been sent to ${recipientFirstName} ${recipientLastName}.`,
      [
        {
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ]
    )
  } catch (error) {
    console.error('Error sending session request:', error)
    Alert.alert("Error", error instanceof Error ? error.message : "Failed to send session request")
  } finally {
    setProcessing(false)
  }
}



  const renderDateTimeOption = (option: number) => {
    const dateTimeState = option === 1 ? dateTime1 : option === 2 ? dateTime2 : dateTime3
    const setDateTimeState = option === 1 ? setDateTime1 : option === 2 ? setDateTime2 : setDateTime3

    return (
      <View key={option} className="mb-4">
        <Text className="text-gray-700 font-semibold mb-3 text-base">
          Option {option}
        </Text>
        
        <View className="flex-row justify-between mb-3">
          {/* Date Picker */}
          <TouchableOpacity
            className="flex-1 mr-2 p-4 rounded-lg border border-gray-200 bg-white"
            onPress={() => setDateTimeState(prev => ({ ...prev, showDatePicker: true }))}
          >
            <View className="flex-row items-center">
              <Ionicons name="calendar" size={20} color={Colors.uaBlue} />
              <View className="ml-3 flex-1">
                <Text className="text-gray-500 text-sm">Date</Text>
                <Text className="text-gray-900 font-medium">
                  {dateTimeState.date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Time Picker */}
          <TouchableOpacity
            className="flex-1 ml-2 p-4 rounded-lg border border-gray-200 bg-white"
            onPress={() => setDateTimeState(prev => ({ ...prev, showTimePicker: true }))}
          >
            <View className="flex-row items-center">
              <Ionicons name="time" size={20} color={Colors.uaBlue} />
              <View className="ml-3 flex-1">
                <Text className="text-gray-500 text-sm">Time</Text>
                <Text className="text-gray-900 font-medium">
                  {formatTimeTo12Hour(dateTimeState.time)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Date Picker Modal */}
        {dateTimeState.showDatePicker && (
          <DateTimePicker
            value={dateTimeState.date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event: any, selectedDate: any) => handleDateChange(option, event, selectedDate)}
            minimumDate={new Date()}
          />
        )}

        {/* Time Picker Modal */}
        {dateTimeState.showTimePicker && (
          <DateTimePicker
            value={dateTimeState.time}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event: any, selectedTime: any) => handleTimeChange(option, event, selectedTime)}
          />
        )}
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1">
            <Text className="text-gray-900 text-2xl font-bold">
              Request a Session
            </Text>
            <Text className="text-gray-600 text-base">
              Send a session request with your preferred times
            </Text>
          </View>
        </View>

        {/* Recipient Info Card */}
        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center">
            <View 
              className="w-20 h-20 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: Colors.uaRed + '20' }}
            >
              {recipientProfilePic ? (
                <Image 
                  source={{ uri: recipientProfilePic }}
                  className="w-20 h-20 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={40} color={Colors.uaRed} />
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-xl">
                {recipientFirstName} {recipientLastName}
              </Text>
              <Text className="text-gray-500 text-base mt-1">
                Sending session request to {recipientType}
              </Text>
            </View>
          </View>
        </View>

        {/* Session Details Card */}
        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm border border-gray-100">
          <Text className="text-gray-900 font-bold text-lg mb-4">
            Session Details
          </Text>
          
          {/* Description */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Description *</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-4 text-gray-900 text-base"
              placeholder="Describe what you'd like to work on in this session..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          {/* Location */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Location *</Text>
            <View className="flex-row items-center border border-gray-200 rounded-lg p-4">
              <Ionicons name="location" size={20} color={Colors.uaRed} />
              <TextInput
                className="flex-1 ml-2 text-gray-900 text-base"
                placeholder="Enter session location..."
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>
        </View>

        {/* Date/Time Selection Card */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
          <Text className="text-gray-900 font-bold text-lg mb-2">
            Preferred Times
          </Text>
          <Text className="text-gray-600 text-sm mb-6">
            Provide 3 time options for the recipient to choose from:
          </Text>
          
          {renderDateTimeOption(1)}
          {renderDateTimeOption(2)}
          {renderDateTimeOption(3)}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity 
            className="flex-1 py-4 rounded-lg mr-3 border border-gray-300"
            onPress={() => navigation.goBack()}
            disabled={processing}
          >
            <Text className="text-gray-700 font-bold text-center text-lg">
              Cancel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-1 py-4 rounded-lg ml-3"
            style={{ 
              backgroundColor: processing ? Colors.grey.medium : Colors.uaBlue,
              opacity: processing ? 0.6 : 1 
            }}
            onPress={handleSendRequest}
            disabled={processing}
          >
            <Text className="text-white font-bold text-center text-lg">
              {processing ? "Sending..." : "Send Request"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default RequestASession
