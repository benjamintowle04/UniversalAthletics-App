import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../themes/colors/Colors';
import '../../../global.css';
import { RouteProp } from '@react-navigation/native';
import { useUser } from '../../contexts/UserContext'

interface SessionDetailsRouteParams {
  sessionId: number;
  sessionDate: string;
  sessionTime: string;
  sessionLocation: string;
  sessionDescription: string;
  coachFirstName?: string;
  coachLastName?: string;
  coachProfilePic?: string;
  memberFirstName?: string;
  memberLastName?: string;
  memberProfilePic?: string;
}

interface SessionDetailsProps {
  route: RouteProp<{ params: SessionDetailsRouteParams }, 'params'>;
}

const SessionDetails = ({ route }: SessionDetailsProps) => {
  // Extract parameters from route
  const {
    sessionId,
    sessionDate,
    sessionTime,
    sessionLocation,
    sessionDescription,
    coachFirstName,
    coachLastName,
    coachProfilePic, 
    memberFirstName,
    memberLastName,
    memberProfilePic
  } = route.params;

  console.log('SessionDetails Props:', {
    sessionId,
    sessionDate,
    sessionTime,
    sessionLocation,
    sessionDescription,
    coachFirstName,
    coachLastName,
    coachProfilePic
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Get current user type from context to decide which participant to show
  const { userData } = useUser()

  const currentUserType = userData?.userType || 'MEMBER'

  // If current user is a COACH, show the member info (if provided), otherwise show coach info
  const otherFirstName = currentUserType === 'COACH' ? route.params.memberFirstName ?? coachFirstName : coachFirstName ?? route.params.memberFirstName
  const otherLastName = currentUserType === 'COACH' ? route.params.memberLastName ?? coachLastName : coachLastName ?? route.params.memberLastName
  const otherProfilePic = currentUserType === 'COACH' ? route.params.memberProfilePic ?? coachProfilePic : coachProfilePic ?? route.params.memberProfilePic

  const otherName = `${otherFirstName || ''} ${otherLastName || ''}`.trim() || (currentUserType === 'COACH' ? 'Member' : 'Coach')

  const isUpcoming = () => {
    const sessionDateTime = new Date(`${sessionDate} ${sessionTime}`);
    const now = new Date();
    return sessionDateTime > now;
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header Card */}
      <View className="bg-white mx-4 mt-6 rounded-xl shadow-sm border border-gray-100">
        <View className="p-6">
          {/* Status Badge */}
          <View className="flex-row justify-between items-start mb-4">
            <View className={`px-3 py-1 rounded-full ${isUpcoming() ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Text className={`text-sm font-medium ${isUpcoming() ? 'text-green-800' : 'text-gray-600'}`}>
                {isUpcoming() ? 'Upcoming' : 'Past Session'}
              </Text>
            </View>
          </View>

          {/* Session Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {sessionDescription || 'Training Session'}
          </Text>
        </View>
      </View>

      {/* Date & Time Card */}
      <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100">
        <View className="p-6">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
              <Ionicons name="calendar" size={20} color={Colors.uaBlue} />
            </View>
            <Text className="text-lg font-semibold text-gray-900">Date & Time</Text>
          </View>
          
          <View className="ml-14 space-y-2">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="#6B7280" />
              <Text className="ml-3 text-gray-700 font-medium">
                {formatDate(sessionDate)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text className="ml-3 text-gray-700 font-medium">
                {formatTime(sessionTime)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Location Card */}
      {sessionLocation && (
        <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100">
          <View className="p-6">
            <View className="flex-row items-center mb-4">
              <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-4">
                <Ionicons name="location" size={20} color="#EF4444" />
              </View>
              <Text className="text-lg font-semibold text-gray-900">Location</Text>
            </View>
            
            <View className="ml-14">
              <Text className="text-gray-700 font-medium">{sessionLocation}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Connection INformation */}
      <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100">
        <View className="p-6">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
              <Ionicons name="person" size={20} color="#8B5CF6" />
            </View>
            <Text className="text-lg font-semibold text-gray-900">Session Takes Place with...</Text>
          </View>
          
          <View className="ml-14 flex-row items-center">
            {/* Profile Picture of the other participant */}
            <View className="mr-4">
              {otherProfilePic ? (
                <Image 
                  source={{ uri: otherProfilePic }}
                  className="w-12 h-12 rounded-full"
                />
              ) : (
                <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center">
                  <Ionicons name="person-outline" size={24} color="#6B7280" />
                </View>
              )}
            </View>
            
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold text-lg">{otherName}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Session Details Card */}
      <View className="bg-white mx-4 mt-4 rounded-xl shadow-sm border border-gray-100">
        <View className="p-6">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-4">
              <Ionicons name="document-text" size={20} color="#F59E0B" />
            </View>
            <Text className="text-lg font-semibold text-gray-900">Session Details</Text>
          </View>
          
          <View className="ml-14">
            <Text className="text-gray-700 leading-6">
              {sessionDescription || 'No additional details provided for this training session.'}
            </Text>
          </View>
        </View>
      </View>

    </ScrollView>
  );
};

export default SessionDetails;
