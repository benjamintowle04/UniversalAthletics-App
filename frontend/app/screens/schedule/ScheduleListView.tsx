import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../themes/colors/Colors';
import '../../../global.css';
import { RouterProps } from '../../types/RouterProps';

interface SessionEntity {
  id?: number; 
  requestId: number; 
  sessionDate: string; 
  sessionTime: string; 
  sessionLocation: string; 
  sessionDescription: string; 
  coachFirebaseId?: string; 
  coachFirstName?: string;
  coachLastName?: string;
  coachProfilePic?: string; 
  coachId: number; 
  memberFirstName?: string; 
  memberLastName?: string; 
  memberProfilePic?: string; 
  memberFirebaseId?: string;
  memberId: number; 
  createdAt?: string;
  updatedAt?: string;
}

interface ScheduleListViewProps extends RouterProps {
  sessions: SessionEntity[];
  loading: boolean;
  error: string | null;
}

const ScheduleListView = ({ sessions, loading, error, navigation }: ScheduleListViewProps) => {
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
    // Assuming time is in HH:MM format, convert to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isUpcoming = (sessionDate: string, sessionTime: string) => {
    const sessionDateTime = new Date(`${sessionDate} ${sessionTime}`);
    const now = new Date();
    return sessionDateTime > now;
  };

  const handleSessionPress = (session: SessionEntity) => {
    console.log('Navigating to session details:', session.id || session.requestId);
    navigation.navigate('SessionDetails', {
      sessionId: session.id || session.requestId,
      sessionDate: session.sessionDate,
      sessionTime: session.sessionTime,
      sessionLocation: session.sessionLocation,
      sessionDescription: session.sessionDescription,
      coachFirstName: session.coachFirstName,
      coachLastName: session.coachLastName,
      coachProfilePic: session.coachProfilePic,
    });
  };

  // Filter to only include future sessions, then sort
  const futureSessions = sessions
    .filter(session => isUpcoming(session.sessionDate, session.sessionTime))
    .sort((a, b) => {
      const dateA = new Date(`${a.sessionDate} ${a.sessionTime}`);
      const dateB = new Date(`${b.sessionDate} ${b.sessionTime}`);
      return dateA.getTime() - dateB.getTime();
    });

  const groupSessionsByDate = () => {
    const grouped: { [key: string]: SessionEntity[] } = {};
    
    futureSessions.forEach(session => {
      const dateKey = session.sessionDate;
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(session);
    });

    return grouped;
  };

  const renderSessionItem = (session: SessionEntity) => {
    const coachName = `${session.coachFirstName || ''} ${session.coachLastName || ''}`.trim() || 'Coach';

    return (
      <TouchableOpacity
        key={session.id || session.requestId}
        className="bg-white rounded-lg p-4 mb-3 border border-gray-200 shadow-sm"
        onPress={() => handleSessionPress(session)}
      >
        <View className="flex-row items-start justify-between">
          <View className="flex-1">
            {/* Session Title */}
            <Text className="text-lg font-semibold text-gray-900 mb-1">
              {session.sessionDescription || 'Training Session'}
            </Text>
            
            {/* Time */}
            <View className="flex-row items-center mb-2">
              <Ionicons name="time-outline" size={16} color={Colors.uaBlue} />
              <Text className="ml-2 text-sm text-gray-600">
                {formatTime(session.sessionTime)}
              </Text>
            </View>

            {/* Coach */}
            <View className="flex-row items-center mb-2">
              <Ionicons name="person-outline" size={16} color={Colors.uaBlue} />
              <Text className="ml-2 text-sm text-gray-600">
                Coach: {coachName}
              </Text>
            </View>

            {/* Location */}
            {session.sessionLocation && (
              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={16} color={Colors.uaBlue} />
                <Text className="ml-2 text-sm text-gray-600">
                  {session.sessionLocation}
                </Text>
              </View>
            )}
          </View>

          {/* Arrow */}
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderDateSection = (date: string, sessions: SessionEntity[]) => {
    return (
      <View key={date} className="mb-6">
        {/* Date Header */}
        <View className="bg-gray-50 px-4 py-3 rounded-lg mb-3">
          <Text className="text-lg font-bold text-gray-900">
            {formatDate(date)}
          </Text>
          <Text className="text-sm text-gray-600">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Sessions for this date */}
        {sessions.map(renderSessionItem)}
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={Colors.uaBlue} />
        <Text className="mt-2 text-gray-600">Loading sessions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-4">
        <Ionicons name="alert-circle" size={48} color="#EF4444" />
        <Text className="mt-2 text-red-600 text-center">{error}</Text>
      </View>
    );
  }

  if (futureSessions.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-4">
        <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
        <Text className="mt-4 text-xl font-semibold text-gray-600">No Upcoming Sessions</Text>
        <Text className="mt-2 text-gray-500 text-center">
          You don't have any upcoming training sessions scheduled.
        </Text>
      </View>
    );
  }

  const groupedSessions = groupSessionsByDate();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Header */}
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-900">Upcoming Sessions</Text>
          <Text className="text-sm text-gray-600 mt-1">
            {futureSessions.length} upcoming session{futureSessions.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Sessions grouped by date */}
        {Object.entries(groupedSessions).map(([date, sessionsForDate]) =>
          renderDateSection(date, sessionsForDate)
        )}
      </View>
    </ScrollView>
  );
};

export default ScheduleListView;
