import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Platform, Animated } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '../../contexts/UserContext'
import { FIREBASE_AUTH } from '../../../firebase_config'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '../../themes/colors/Colors'
import { acceptSessionRequest, declineSessionRequest } from '../../../controllers/SessionRequestController'
import { createSession } from '../../../controllers/SessionController'
import "../../../global.css"
import { getUnsignedUrl } from '../../../utils/UnsignUrls'

interface SessionRequestDetailsProps {
  navigation: any;
  route: {
    params: {
      sessionRequestId: number;
    };
    key: string;
    name: string;
    path?: string;
  }
}

// Custom Notification Component
const CustomNotification = ({ 
  visible, 
  message, 
  type = 'warning', 
  onHide 
}: { 
  visible: boolean; 
  message: string; 
  type?: 'warning' | 'error' | 'success'; 
  onHide: () => void; 
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide();
      });
    }
  }, [visible]);

  if (!visible) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'error': return '#EF4444';
      case 'success': return '#10B981';
      case 'warning': 
      default: return '#F59E0B';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error': return 'close-circle';
      case 'success': return 'checkmark-circle';
      case 'warning':
      default: return 'warning';
    }
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: Platform.OS === 'web' ? 20 : 60,
        left: 20,
        right: 20,
        zIndex: 1000,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View
        className="flex-row items-center p-4 rounded-lg shadow-lg"
        style={{ backgroundColor: getBackgroundColor() }}
      >
        <Ionicons name={getIcon()} size={24} color="white" />
        <Text className="text-white font-semibold text-base ml-3 flex-1">
          {message}
        </Text>
        <TouchableOpacity onPress={onHide}>
          <Ionicons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const SessionRequestDetails = ({navigation, route}: SessionRequestDetailsProps) => {
  const { userData, updateUserData } = useUser()
  const [processing, setProcessing] = useState(false)
  const [selectedDateTime, setSelectedDateTime] = useState<number | null>(null) 
  const [sessionRequest, setSessionRequest] = useState<any>(null)
  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    type: 'warning' | 'error' | 'success';
  }>({
    visible: false,
    message: '',
    type: 'warning'
  });

  const { sessionRequestId } = route.params

  // Find the specific session request
  useEffect(() => {
    if (userData?.pendingSessionRequests) {
      const request = userData.pendingSessionRequests.find(req => req.id === sessionRequestId)
      setSessionRequest(request)
    }
  }, [userData?.pendingSessionRequests, sessionRequestId])

  // Helper function to show notification
  const showNotification = (message: string, type: 'warning' | 'error' | 'success' = 'warning') => {
    setNotification({
      visible: true,
      message,
      type
    });
  };

  // Helper function to hide notification
  const hideNotification = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };

  // Helper function to convert 24hr time to 12hr format
  const formatTimeTo12Hour = (time24: string) => {
    if (!time24) return ""
    
    const [hours, minutes] = time24.split(':')
    const hour24 = parseInt(hours, 10)
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
    const ampm = hour24 >= 12 ? 'PM' : 'AM'
    
    return `${hour12}:${minutes} ${ampm}`
  }

  const handleSelectDateTime = (option: number) => {
    setSelectedDateTime(option)
  }

  const confirmAcceptSessionRequest = () => {
    if (!userData || !sessionRequest) return;
    
    if (!selectedDateTime) {
      if (Platform.OS === 'web') {
        showNotification("Please select a date and time option before accepting the session request.", 'warning');
      } else {
        Alert.alert("Please Select", "Please select a date and time option before accepting the session request.")
      }
      return
    }

    const selectedTimeText = getSelectedDateTimeText(selectedDateTime);
    
    if (Platform.OS === 'web') {
      // For web, show a confirmation notification and proceed
      showNotification(`Accepting session for ${selectedTimeText}...`, 'success');
      setTimeout(() => {
        handleAcceptSessionRequest();
      }, 1000);
    } else {
      // For mobile, use native Alert
      Alert.alert(
        "Confirm Accept",
        `Are you sure you want to accept this session request for ${selectedTimeText}?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Accept",
            style: "default",
            onPress: handleAcceptSessionRequest
          }
        ]
      );
    }
  }

const handleAcceptSessionRequest = async () => {
  if (!userData || !sessionRequest) return;
  
  // Double-check date selection
  if (!selectedDateTime) {
    if (Platform.OS === 'web') {
      showNotification("Please select a date and time option first.", 'warning');
    } else {
      Alert.alert("Please Select", "Please select a date and time option before accepting the session request.")
    }
    return;
  }
  
  setProcessing(true);
  
  try {
    //Accept the session request and update the request status
    await acceptSessionRequest(sessionRequest.id, userData.id);
    
    // Create the actual session
    const selectedDateTimeData = getSelectedDateTimeData(selectedDateTime);
    const sessionData = {
      requestId: sessionRequest.id,
      sessionDate: selectedDateTimeData.date,
      sessionTime: selectedDateTimeData.time,
      sessionLocation: sessionRequest.sessionLocation,
      sessionDescription: sessionRequest.sessionDescription,
      // Use multiple fallbacks for firebase IDs to avoid nulls (senderFirebaseId or senderFirebaseID)
      coachFirebaseId: sessionRequest.senderFirebaseId || sessionRequest.senderFirebaseID || '',
      coachFirstName: sessionRequest.senderFirstName,
      coachLastName: sessionRequest.senderLastName,
      coachProfilePic: getUnsignedUrl(sessionRequest.senderProfilePic),
      coachId: sessionRequest.senderId,
      memberFirstName: userData.firstName,
      memberLastName: userData.lastName,
      memberProfilePic: getUnsignedUrl(userData.profilePic),
      // Use fallbacks for member firebase ID: prefer userData.firebaseId, then firebaseID, then auth uid
      memberFirebaseId: userData.firebaseId || (userData as any).firebaseID || FIREBASE_AUTH.currentUser?.uid || '',
      memberId: userData.id
    };
    console.log('Creating session with payload:', sessionData);

    const createdSession = await createSession(sessionData);
    console.log("Session created successfully:", createdSession);
    
    //Update local state
    const updatedRequests = userData.pendingSessionRequests.filter(
      req => req.id !== sessionRequest.id
    );
    
    updateUserData({
      pendingSessionRequests: updatedRequests
    });
    
    //Inform user on success
    const successMessage = `Session request accepted and session scheduled for ${getSelectedDateTimeText(selectedDateTime)}!`;
    
    if (Platform.OS === 'web') {
      showNotification(successMessage, 'success');
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } else {
      Alert.alert(
        "Success", 
        successMessage,
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );
    }

  } catch (error) {
    // Inform user on error
    console.error('Error accepting session request or creating session:', error);
    const errorMessage = error instanceof Error ? error.message : "Failed to accept session request";
    
    if (Platform.OS === 'web') {
      showNotification(errorMessage, 'error');
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } else {
      Alert.alert("Error", errorMessage);
      navigation.goBack();
    }
  } finally {
    setProcessing(false);
  }
};

// Add this helper function to extract the selected date/time data:
const getSelectedDateTimeData = (option: number | null) => {
  if (!sessionRequest) return { date: '', time: '' }
  if (!option) return {date:'', time: ''}
  const dates = [sessionRequest.sessionDate1, sessionRequest.sessionDate2, sessionRequest.sessionDate3]
  const times = [sessionRequest.sessionTime1, sessionRequest.sessionTime2, sessionRequest.sessionTime3]
  
  return {
    date: dates[option - 1],
    time: times[option - 1]
  }
}

  const confirmDeclineSessionRequest = () => {
    if (!userData || !sessionRequest) return;
    
    const coachName = sessionRequest.senderFirstName && sessionRequest.senderLastName
      ? `${sessionRequest.senderFirstName} ${sessionRequest.senderLastName}`
      : `Coach #${sessionRequest.senderId}`;
    
    if (Platform.OS === 'web') {
      showNotification(`Declining session request from ${coachName}...`, 'warning');
      setTimeout(() => {
        handleDeclineSessionRequest();
      }, 1000);
    } else {
      Alert.alert(
        "Confirm Decline",
        `Are you sure you want to decline this session request from ${coachName}?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Decline",
            style: "destructive",
            onPress: handleDeclineSessionRequest
          }
        ]
      );
    }
  }

  const handleDeclineSessionRequest = async () => {
    if (!userData || !sessionRequest) return;
    
    setProcessing(true);
    
    try {
      await declineSessionRequest(sessionRequest.id, userData.id);
      
      // Remove the request from the pending list
      const updatedRequests = userData.pendingSessionRequests.filter(
        req => req.id !== sessionRequest.id
      );
      
      updateUserData({
        pendingSessionRequests: updatedRequests
      });
      
      if (Platform.OS === 'web') {
        showNotification("Session request has been declined.", 'success');
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        Alert.alert(
          "Request Declined", 
          "Session request has been declined.",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error declining session request:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to decline session request";
      
      if (Platform.OS === 'web') {
        showNotification(errorMessage, 'error');
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        Alert.alert("Error", errorMessage);
      }
      navigation.goBack()
    } finally {
      setProcessing(false);
    }
  };

  const getSelectedDateTimeText = (option: number | null) => {
    if (!sessionRequest) return ""
    if (!option) return ""

    
    const dates = [sessionRequest.sessionDate1, sessionRequest.sessionDate2, sessionRequest.sessionDate3]
    const times = [sessionRequest.sessionTime1, sessionRequest.sessionTime2, sessionRequest.sessionTime3]
    
    return `${new Date(dates[option - 1]).toLocaleDateString()} at ${formatTimeTo12Hour(times[option - 1])}`
  }

  const renderDateTimeOption = (option: number) => {
    if (!sessionRequest) return null
    
    const dates = [sessionRequest.sessionDate1, sessionRequest.sessionDate2, sessionRequest.sessionDate3]
    const times = [sessionRequest.sessionTime1, sessionRequest.sessionTime2, sessionRequest.sessionTime3]
    const isSelected = selectedDateTime === option
    
    return (
      <TouchableOpacity
        key={option}
        className={`p-4 rounded-lg border-2 mb-3 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
        onPress={() => handleSelectDateTime(option)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className={`font-bold text-lg ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
              Option {option}
            </Text>
            <Text className={`text-base mt-1 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
              📅 {new Date(dates[option - 1]).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Text className={`text-base ${isSelected ? 'text-blue-600' : 'text-gray-600'}`}>
              🕐 {formatTimeTo12Hour(times[option - 1])}
            </Text>
          </View>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={28} color={Colors.uaBlue} />
          )}
        </View>
      </TouchableOpacity>
    )
  }

  if (!sessionRequest) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <CustomNotification
          visible={notification.visible}
          message={notification.message}
          type={notification.type}
          onHide={hideNotification}
        />
        <Ionicons name="alert-circle-outline" size={64} color={Colors.grey.medium} />
        <Text className="text-gray-500 text-lg mt-4">Session request not found</Text>
        <TouchableOpacity 
          className="mt-4 px-6 py-3 rounded-lg"
          style={{ backgroundColor: Colors.uaBlue }}
          onPress={() => navigation.goBack()}
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Custom Notification */}
      <CustomNotification
        visible={notification.visible}
        message={notification.message}
        type={notification.type}
        onHide={hideNotification}
      />
      
      <View className="p-4">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <View className="flex-1">
            <Text className="text-gray-900 text-2xl font-bold">
              Session Request
            </Text>
            <Text className="text-gray-600 text-base">
              Review the details and select your preferred time
            </Text>
          </View>
        </View>

        {/* Coach Info Card */}
        <View className="bg-white rounded-lg p-6 mb-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center">
            <View 
              className="w-20 h-20 rounded-full items-center justify-center mr-4"
              style={{ backgroundColor: Colors.uaRed + '20' }}
            >
              {sessionRequest.senderProfilePic ? (
                <Image 
                  source={{ uri: sessionRequest.senderProfilePic }}
                  className="w-20 h-20 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={40} color={Colors.uaRed} />
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 font-bold text-xl">
                {sessionRequest.senderFirstName && sessionRequest.senderLastName
                  ? `${sessionRequest.senderFirstName} ${sessionRequest.senderLastName}`
                  : `Coach #${sessionRequest.senderId}`
                }
              </Text>
              <Text className="text-gray-500 text-base mt-1">
                Wants to schedule a session with you
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                Received {new Date(sessionRequest.createdAt).toLocaleDateString()}
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
            <Text className="text-gray-700 font-semibold mb-2">Description:</Text>
            <Text className="text-gray-600 text-base leading-6">
              {sessionRequest.sessionDescription || sessionRequest.message || "No description provided"}
            </Text>
          </View>
          
          {/* Location */}
          <View className="mb-4">
            <Text className="text-gray-700 font-semibold mb-2">Location:</Text>
            <View className="flex-row items-center">
              <Ionicons name="location" size={20} color={Colors.uaRed} />
              <Text className="text-gray-600 text-base ml-2">
                {sessionRequest.sessionLocation}
              </Text>
            </View>
          </View>
        </View>

        {/* Date/Time Selection Card */}
        <View className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-100">
          <Text className="text-gray-900 font-bold text-lg mb-4">
            Choose Your Preferred Time
          </Text>
          <Text className="text-gray-600 text-sm mb-4">
            Select one of the available time slots below:
          </Text>
          
          {renderDateTimeOption(1)}
          {renderDateTimeOption(2)}
          {renderDateTimeOption(3)}
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity 
            className="flex-1 py-4 rounded-lg mr-3"
            style={{ 
              backgroundColor: processing ? Colors.grey.medium : Colors.uaGreen,
              opacity: processing ? 0.6 : 1 
            }}
            onPress={confirmAcceptSessionRequest}
            disabled={processing}
          >
            <Text className="text-white font-bold text-center text-lg">
              {processing ? "Processing..." : "Accept"}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="flex-1 py-4 rounded-lg ml-3"
            style={{ 
              backgroundColor: processing ? Colors.grey.medium : Colors.uaRed,
              opacity: processing ? 0.6 : 1 
            }}
            onPress={confirmDeclineSessionRequest}
            disabled={processing}
          >
            <Text className="text-white font-bold text-center text-lg">
              {processing ? "Processing..." : "Decline"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

export default SessionRequestDetails

