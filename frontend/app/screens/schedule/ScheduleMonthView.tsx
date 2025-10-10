import React from 'react';
import { Platform, Dimensions } from 'react-native';
import { RouterProps } from '../../types/RouterProps';
import ScheduleMonthViewWebUI from '../../ui/web/schedule/ScheduleMonthViewWebUI';
import ScheduleMonthViewMobileUI from '../../ui/mobile/schedule/ScheduleMonthViewMobileUI';

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

interface ScheduleMonthViewProps extends RouterProps {
  sessions: SessionEntity[];
  loading: boolean;
  error: string | null;
}

export default function ScheduleMonthView({ sessions, loading, error, navigation, route }: ScheduleMonthViewProps) {
  // Platform detection
  const { width } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = width > 768;

  // Prepare props for UI components
  const uiProps = {
    sessions,
    loading,
    error,
    navigation,
    route
  };

  // Render appropriate UI based on platform and screen size
  if (isWeb && isLargeScreen) {
    return <ScheduleMonthViewWebUI {...uiProps} />;
  }

  // Use mobile UI for mobile devices and small screens
  return <ScheduleMonthViewMobileUI {...uiProps} />;
}
