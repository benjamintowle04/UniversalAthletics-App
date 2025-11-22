import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import "../../../../global.css"
import { Colors } from '../../../themes/colors/Colors';
import { RouterProps } from '../../../types/RouterProps';
import { useUser } from '../../../contexts/UserContext'

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

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
  participantName: string;
  type: 'session';
  color: string;
  sessionData: SessionEntity;
}

interface DayData {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

interface ScheduleMonthViewWebUIProps extends RouterProps {
  sessions: SessionEntity[];
  loading: boolean;
  error: string | null;
}

export default function ScheduleMonthViewWebUI({ sessions, loading, error, navigation }: ScheduleMonthViewWebUIProps) {
  const { userData } = useUser()
  const currentUserType = userData?.userType || 'MEMBER'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [calendarData, setCalendarData] = useState<DayData[]>([]);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const isWeb = Platform.OS === 'web';
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayNamesShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        


  useEffect(() => {
    generateCalendarData();
  }, [currentDate, sessions]);

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSessionPress = (session: SessionEntity) => {
    console.log('Navigating to session details:', session.sessionTime);
    navigation.navigate('SessionDetails', {
      sessionId: session.id || session.requestId,
      sessionDate: session.sessionDate,
      sessionTime: session.sessionTime,
      sessionLocation: session.sessionLocation,
      sessionDescription: session.sessionDescription,
      coachFirstName: session.coachFirstName,
      coachLastName: session.coachLastName,
      coachProfilePic: session.coachProfilePic,
      memberFirstName: session.memberFirstName,
      memberLastName: session.memberLastName,
      memberProfilePic: session.memberProfilePic,
    });
  };

  const convertSessionsToEvents = (): { [key: string]: CalendarEvent[] } => {
    const eventsMap: { [key: string]: CalendarEvent[] } = {};
    
    sessions.forEach(session => {
      const dateKey = session.sessionDate;
      const coachName = `${session.coachFirstName || ''} ${session.coachLastName || ''}`.trim()
      const memberName = `${session.memberFirstName || ''} ${session.memberLastName || ''}`.trim()

      const participantName = currentUserType === 'COACH' ? (memberName || 'Member') : (coachName || 'Coach')

      const event: CalendarEvent = {
        id: session.id?.toString() || session.requestId.toString(),
        title: session.sessionDescription || 'Training Session',
        time: formatTime(session.sessionTime),
        location: session.sessionLocation,
        description: session.sessionDescription,
        participantName: participantName,
        type: 'session',
        color: Colors.uaBlue,
        sessionData: session,
      };

      if (!eventsMap[dateKey]) {
        eventsMap[dateKey] = [];
      }
      eventsMap[dateKey].push(event);
    });

    return eventsMap;
  };

  const generateCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar: DayData[] = [];
    const eventsMap = convertSessionsToEvents();
    
    for (let i = 0; i < 42; i++) {
      const currentDay = new Date(startDate);
      currentDay.setDate(startDate.getDate() + i);
      
      const dateKey = currentDay.toISOString().split('T')[0];
      const isCurrentMonth = currentDay.getMonth() === month;
      const isToday = 
        currentDay.getDate() === today.getDate() &&
        currentDay.getMonth() === today.getMonth() &&
        currentDay.getFullYear() === today.getFullYear();
      
      calendar.push({
        date: currentDay.getDate(),
        isCurrentMonth,
        isToday,
        events: eventsMap[dateKey] || [],
      });
    }
    
    setCalendarData(calendar);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const handleDatePress = (date: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      setSelectedDate(selectedDate === date ? null : date);
    }
  };

  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateKey = new Date(year, month, selectedDate).toISOString().split('T')[0];
    const eventsMap = convertSessionsToEvents();
    return eventsMap[dateKey] || [];
  };

  const renderCalendarDay = (dayData: DayData, index: number) => {
    const isSelected = selectedDate === dayData.date && dayData.isCurrentMonth;
    const isHovered = hoveredDay === dayData.date && dayData.isCurrentMonth;
    const hasEvents = dayData.events.length > 0;

    return (
      <TouchableOpacity
        key={index}
        className={`
          relative p-3 min-h-[120px] transition-all duration-200 flex-1
          ${isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'}
          ${!dayData.isCurrentMonth ? 'bg-gray-50 hover:bg-gray-100' : ''}
          ${isHovered ? 'shadow-md' : ''}
        `}
        style={{
          borderRightWidth: (index + 1) % 7 !== 0 ? 1 : 0,
          borderRightColor: '#E5E7EB',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}
        onPress={() => handleDatePress(dayData.date, dayData.isCurrentMonth)}
        onPressIn={() => setHoveredDay(dayData.date)}
        onPressOut={() => setHoveredDay(null)}
      >
        <View className="flex-1">
          {/* Date number */}
          <View className="flex-row justify-between items-start mb-2">
            <Text
              className={`
                text-sm font-semibold
                ${dayData.isToday ? 'text-white bg-blue-500 rounded-full w-7 h-7 text-center leading-7' : ''}
                ${!dayData.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
                ${isSelected && !dayData.isToday ? 'text-blue-600 font-bold' : ''}
              `}
            >
              {dayData.date}
            </Text>
            
            {/* Event count indicator */}
            {hasEvents && (
              <View 
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: Colors.uaBlue + '20' }}
              >
                <Text 
                  className="text-xs font-medium"
                  style={{ color: Colors.uaBlue }}
                >
                  {dayData.events.length}
                </Text>
              </View>
            )}
          </View>
          
          {/* Event previews */}
          {hasEvents && (
            <View className="flex-1 space-y-1">
              {dayData.events.slice(0, 3).map((event, eventIndex) => (
                <TouchableOpacity
                  key={event.id}
                  className="px-2 py-1 rounded text-xs hover:shadow-sm transition-shadow"
                  style={{ 
                    backgroundColor: event.color + '15', 
                    borderLeftWidth: 3,
                    borderLeftColor: event.color
                  }}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleSessionPress(event.sessionData);
                  }}
                >
                  <Text 
                    className="font-medium text-xs truncate"
                    style={{ color: event.color }}
                  >
                    {event.time}
                  </Text>
                  <Text className="text-xs text-gray-700 truncate">
                    {event.title}
                  </Text>
                  <Text className="text-xs text-gray-500 truncate">
                    {event.participantName}
                  </Text>
                </TouchableOpacity>
              ))}
              
              {dayData.events.length > 3 && (
                <Text className="text-xs text-gray-500 px-2">
                  +{dayData.events.length - 3} more
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEventCard = (event: CalendarEvent) => (
    <TouchableOpacity
      key={event.id}
      className="bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200"
      onPress={() => handleSessionPress(event.sessionData)}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row items-start flex-1">
          <View
            className="w-4 h-4 rounded-full mr-4 mt-1"
            style={{ backgroundColor: event.color }}
          />
          <View className="flex-1">
            <Text className="font-bold text-lg text-gray-900 mb-1">{event.title}</Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="time-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2 font-medium">{event.time}</Text>
            </View>
            
            <View className="flex-row items-center mb-2">
              <Ionicons name="person-outline" size={16} color="#6B7280" />
              <Text className="text-gray-600 ml-2">with {event.participantName}</Text>
            </View>
            
            {event.location && (
              <View className="flex-row items-center mb-2">
                <Ionicons name="location-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 ml-2">{event.location}</Text>
              </View>
            )}
            
            {event.description && (
              <Text className="text-gray-500 text-sm mt-2">{event.description}</Text>
            )}
          </View>
        </View>
        
        <View className="ml-4">
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSidebar = () => (
    <View className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      {selectedDate ? (
        <View>
          <Text className="text-xl font-bold text-gray-900 mb-4">
            {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
          </Text>
          
          {getSelectedDateEvents().length > 0 ? (
            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-4">
                {getSelectedDateEvents().length} session{getSelectedDateEvents().length !== 1 ? 's' : ''} scheduled
              </Text>
              {getSelectedDateEvents().map(renderEventCard)}
            </View>
          ) : (
            <View className="text-center py-12">
              <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mx-auto mb-4">
                <Ionicons name="calendar-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-gray-500 text-lg font-medium mb-2">No sessions scheduled</Text>
              <Text className="text-gray-400">This day is free for new sessions</Text>
            </View>
          )}
        </View>
      ) : (
        <View className="text-center py-12">
          <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mx-auto mb-4">
            <Ionicons name="hand-left-outline" size={32} color="#9CA3AF" />
          </View>
          <Text className="text-gray-500 text-lg font-medium mb-2">Select a date</Text>
          <Text className="text-gray-400">Click on any date to view sessions</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color={Colors.uaBlue} />
        <Text className="mt-4 text-gray-600 text-lg">Loading sessions...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-4 bg-gray-50">
        <View className="bg-white rounded-2xl p-12 shadow-lg max-w-md w-full text-center">
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text className="mt-4 text-red-600 text-xl font-semibold">Error Loading Schedule</Text>
          <Text className="mt-2 text-gray-600 text-center">{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 min-h-screen">
      {/* Header */}
      <View className="bg-white shadow-sm border-b border-gray-200">
        <View className="web-container py-6 px-4">
          <View className="flex-row items-center justify-between">
            {/* Month navigation */}
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity
                onPress={() => navigateMonth('prev')}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                accessibilityLabel="Previous Month"
              >
                <Ionicons name="chevron-back" size={28} color="#374151" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </Text>
              <TouchableOpacity
                onPress={() => navigateMonth('next')}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                accessibilityLabel="Next Month"
              >
                <Ionicons name="chevron-forward" size={28} color="#374151" />
              </TouchableOpacity>
            </View>
            {/* You can add more header content here if needed */}
          </View>
        </View>
      </View>

      {/* Main content: Calendar grid + Sidebar */}
      <View className="flex-1 flex-row w-full">
        {/* Calendar Grid */}
        <View className="flex-1 p-6 overflow-y-auto">
          <View className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Day headers */}
            <View className="flex-row border-b border-gray-200 bg-gray-50">
              {dayNames.map((day, index) => (
                <View key={day} className="flex-1 py-4" style={{ borderRightWidth: (index + 1) % 7 !== 0 ? 1 : 0, borderRightColor: '#E5E7EB' }}>
                  <Text className="text-center text-sm font-bold text-gray-700">
                    {day}
                  </Text>
                  <Text className="text-center text-xs text-gray-500 mt-1">
                    {dayNamesShort[index]}
                  </Text>
                </View>
              ))}
            </View>

            {/* Calendar days */}
            <View className="flex-1">
              {Array.from({ length: 6 }, (_, weekIndex) => (
                <View key={weekIndex} className="flex-row flex-1">
                  {calendarData
                    .slice(weekIndex * 7, (weekIndex + 1) * 7)
                    .map((dayData, dayIndex) =>
                      renderCalendarDay(dayData, weekIndex * 7 + dayIndex)
                    )}
                </View>
              ))}
            </View>
          </View>

          {/* Legend */}
          <View className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <Text className="text-sm font-bold text-gray-700 mb-3">Session Types</Text>
            <View className="flex-row flex-wrap gap-4">
              <View className="flex-row items-center">
                <View className="w-4 h-4 rounded-full mr-2" style={{backgroundColor: Colors.uaBlue}} />
                <Text className="text-sm text-gray-600">Training Sessions</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-4 h-4 rounded-full mr-2 bg-gray-300" />
                <Text className="text-sm text-gray-600">Available Days</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Sidebar */}
        {renderSidebar()}
      </View>
    </View>
  );
}

