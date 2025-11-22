import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScheduleMonthView from './ScheduleMonthView';
import ScheduleListView from './ScheduleListView';
import '../../../global.css'; 
import { Colors } from '../../themes/colors/Colors';
import { getSessionsByMemberId, getSessionsByCoachId } from '../../../controllers/SessionController';
import { useUser } from '../../contexts/UserContext';
import { RouterProps } from '../../types/RouterProps';

type ViewType = 'month' | 'list';

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

interface ScheduleContainerProps extends RouterProps {}

export default function ScheduleContainer({ navigation, route }: ScheduleContainerProps) {
  const { userData } = useUser();
  const [currentView, setCurrentView] = useState<ViewType>('month');
  const [sessions, setSessions] = useState<SessionEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userData?.id) {
      fetchSessions();
    }
  }, [userData?.id]);

  const fetchSessions = async () => {
    if (!userData?.id) {
      setError('User data not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Fetch sessions according to user type: coaches see sessions for their coachId, members see their sessions
      let sessionData;
      if (userData.userType === 'COACH') {
        sessionData = await getSessionsByCoachId(userData.id);
      } else {
        sessionData = await getSessionsByMemberId(userData.id);
      }
      console.log('Fetched sessions from API:', sessionData);
      if (!sessionData || !Array.isArray(sessionData)) {
        console.warn('Sessions API returned no sessions or invalid format', sessionData);
      }
      setSessions(sessionData);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state if user data is not yet available
  if (!userData) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text>Loading user data...</Text>
      </View>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'month':
        return (
          <ScheduleMonthView 
            sessions={sessions} 
            loading={loading} 
            error={error} 
            navigation={navigation}
            route={route}
          />
        );
      case 'list':
        return (
          <ScheduleListView 
            sessions={sessions} 
            loading={loading} 
            error={error} 
            navigation={navigation}
            route={route}
          />
        );
      default:
        return (
          <ScheduleMonthView 
            sessions={sessions} 
            loading={loading} 
            error={error} 
            navigation={navigation}
            route={route}
          />
        );
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* View Toggle Header */}
      <View className="flex-row bg-gray-100 m-2.5 rounded-lg p-1">
        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-md ${
            currentView === 'month' ? 'bg-blue-600' : ''
          }`}
          style={currentView === 'month' ? { backgroundColor: Colors.uaBlue } : {}}
          onPress={() => setCurrentView('month')}
        >
          <Ionicons 
            name="calendar" 
            size={20} 
            color={currentView === 'month' ? 'white' : Colors.uaBlue} 
          />
          <Text className={`ml-1 text-sm font-medium ${
            currentView === 'month' ? 'text-white' : ''
          }`}
          style={currentView === 'month' ? {} : { color: Colors.uaBlue }}
          >
            Month
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-md ${
            currentView === 'list' ? 'bg-blue-600' : ''
          }`}
          style={currentView === 'list' ? { backgroundColor: Colors.uaBlue } : {}}
          onPress={() => setCurrentView('list')}
        >
          <Ionicons 
            name="list" 
            size={20} 
            color={currentView === 'list' ? 'white' : Colors.uaBlue} 
          />
          <Text className={`ml-1 text-sm font-medium ${
            currentView === 'list' ? 'text-white' : ''
          }`}
          style={currentView === 'list' ? {} : { color: Colors.uaBlue }}
          >
            List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Current View */}
      <View className="flex-1">
        {renderCurrentView()}
      </View>
    </View>
  );
}
