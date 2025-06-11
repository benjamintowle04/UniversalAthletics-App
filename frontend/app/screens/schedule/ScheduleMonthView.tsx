import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import "../../../global.css"
import { Colors } from '../../themes/colors/Colors';
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

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  location: string;
  description: string;
  coachName: string;
  type: 'session';
  color: string;
  sessionData: SessionEntity; // Store original session data for navigation
}

interface DayData {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: CalendarEvent[];
}

interface ScheduleMonthViewProps extends RouterProps {
  sessions: SessionEntity[];
  loading: boolean;
  error: string | null;
}

export default function ScheduleMonthView({ sessions, loading, error, navigation }: ScheduleMonthViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [calendarData, setCalendarData] = useState<DayData[]>([]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    generateCalendarData();
  }, [currentDate, sessions]);

  const formatTime = (timeString: string) => {
    // Assuming time is in HH:MM format, convert to 12-hour format
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
    });
  };

  const convertSessionsToEvents = (): { [key: string]: CalendarEvent[] } => {
    const eventsMap: { [key: string]: CalendarEvent[] } = {};
    
    sessions.forEach(session => {
      const dateKey = session.sessionDate; // Assuming sessionDate is in YYYY-MM-DD format
      const coachName = `${session.coachFirstName || ''} ${session.coachLastName || ''}`.trim() || 'Coach';
      
      const event: CalendarEvent = {
        id: session.id?.toString() || session.requestId.toString(),
        title: session.sessionDescription || 'Training Session',
        time: formatTime(session.sessionTime),
        location: session.sessionLocation,
        description: session.sessionDescription,
        coachName: coachName,
        type: 'session',
        color: Colors.uaBlue,
        sessionData: session, // Store original session data
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
    
    // First day of the month and last day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Start from the first Sunday of the calendar view
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const calendar: DayData[] = [];
    const eventsMap = convertSessionsToEvents();
    
    // Generate 42 days (6 weeks)
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
    const hasEvents = dayData.events.length > 0;

    return (
      <TouchableOpacity
        key={index}
        className={`
          flex-1 aspect-square border-r border-b border-gray-200 p-1
          ${isSelected ? 'bg-blue-100' : 'bg-white'}
          ${!dayData.isCurrentMonth ? 'bg-gray-50' : ''}
        `}
        onPress={() => handleDatePress(dayData.date, dayData.isCurrentMonth)}
      >
        <View className="flex-1">
          <Text
            className={`
              text-sm font-medium text-center
              ${dayData.isToday ? 'text-white bg-blue-500 rounded-full w-6 h-6 leading-6' : ''}
              ${!dayData.isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
              ${isSelected && !dayData.isToday ? 'text-blue-600 font-bold' : ''}
            `}
          >
            {dayData.date}
          </Text>
          
          {/* Event indicators */}
          {hasEvents && (
            <View className="flex-1 mt-1">
              {dayData.events.slice(0, 2).map((event, eventIndex) => (
                <View
                  key={event.id}
                  className="h-1 rounded-full mb-0.5"
                  style={{ backgroundColor: event.color }}
                />
              ))}
              {dayData.events.length > 2 && (
                <Text className="text-xs text-gray-500 text-center">
                  +{dayData.events.length - 2}
                </Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEventItem = (event: CalendarEvent) => (
    <TouchableOpacity
      key={event.id}
      className="bg-white rounded-lg p-3 mb-2 border border-gray-200 shadow-sm"
      onPress={() => handleSessionPress(event.sessionData)}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className="w-3 h-3 rounded-full mr-3"
            style={{ backgroundColor: event.color }}
          />
          <View className="flex-1">
            <Text className="font-semibold text-gray-900">{event.title}</Text>
            <Text className="text-sm text-gray-600">{event.time}</Text>
            <Text className="text-sm text-gray-500">with {event.coachName}</Text>
            {event.location && (
              <Text className="text-sm text-gray-500">📍 {event.location}</Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

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

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigateMonth('prev')}
            className="p-2 rounded-full"
          >
            <Ionicons name="chevron-back" size={24} color="#3B82F6" />
          </TouchableOpacity>
          
          <Text className="text-xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          
          <TouchableOpacity
            onPress={() => navigateMonth('next')}
            className="p-2 rounded-full"
          >
            <Ionicons name="chevron-forward" size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Calendar Grid */}
        <View className="bg-white mx-4 mt-4 rounded-lg shadow-sm border border-gray-200">
          {/* Day headers */}
          <View className="flex-row border-b border-gray-200">
            {dayNames.map((day) => (
              <View key={day} className="flex-1 py-3 border-r border-gray-200 last:border-r-0">
                <Text className="text-center text-sm font-semibold text-gray-600">
                  {day}
                </Text>
              </View>
            ))}
          </View>

          {/* Calendar days */}
          {Array.from({ length: 6 }, (_, weekIndex) => (
            <View key={weekIndex} className="flex-row">
              {calendarData
                .slice(weekIndex * 7, (weekIndex + 1) * 7)
                .map((dayData, dayIndex) => 
                  renderCalendarDay(dayData, weekIndex * 7 + dayIndex)
                )}
            </View>
          ))}
        </View>

        {/* Selected Date Events */}
        {selectedDate && (
          <View className="mx-4 mt-4 mb-6">
            <Text className="text-lg font-bold text-gray-900 mb-3">
              Events for {monthNames[currentDate.getMonth()]} {selectedDate}
            </Text>
            
            {getSelectedDateEvents().length > 0 ? (
              getSelectedDateEvents().map(renderEventItem)
            ) : (
              <View className="bg-white rounded-lg p-6 border border-gray-200">
                <Text className="text-center text-gray-500">
                  No sessions scheduled for this day
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Legend */}
        <View className="mx-4 mb-6 mt-4">
          <Text className="text-sm font-semibold text-gray-700 mb-2">Session Types</Text>
          <View className="flex-row flex-wrap">
            <View className="flex-row items-center mr-4 mb-2">
              <View className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: Colors.uaBlue}} />
              <Text className="text-sm text-gray-600">Training Sessions</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
