import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../themes/colors/Colors';

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: '1 on 1' | 'group';
  color: string;
  startHour: number;
  startMinute: number;
  duration: number; // in minutes
}

interface DayData {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  events: CalendarEvent[];
}

export default function ScheduleWeekView() {
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Helper function to parse time string to hour and minute
  const parseTime = (timeString: string) => {
    const [time, period] = timeString.split(' ');
    const [hourStr, minuteStr] = time.split(':');
    let hour = parseInt(hourStr);
    const minute = parseInt(minuteStr) || 0;
    
    if (period === 'PM' && hour !== 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }
    
    return { hour, minute };
  };

  // Sample events data - matching ScheduleMonthView.tsx with calculated times
  const sampleEvents: { [key: string]: CalendarEvent[] } = {
    '2025-06-15': [
      { 
        id: '1', 
        title: 'Training Session', 
        time: '10:00 AM', 
        type: '1 on 1', 
        color: Colors.uaGreen,
        startHour: 10,
        startMinute: 0,
        duration: 120 // 2 hours
      },
      { 
        id: '2', 
        title: 'Coach Meeting', 
        time: '2:00 PM', 
        type: 'group', 
        color: Colors.uaBlue,
        startHour: 14,
        startMinute: 0,
        duration: 60 // 1 hour
      },
    ],
    '2025-06-25': [
      { 
        id: '4', 
        title: 'Skills Training', 
        time: '11:00 AM', 
        type: '1 on 1', 
        color: Colors.uaGreen,
        startHour: 11,
        startMinute: 0,
        duration: 120 // 2 hours
      },
    ],
    '2025-06-30': [
      { 
        id: '5', 
        title: 'Team Strategy Meeting', 
        time: '1:00 PM', 
        type: 'group', 
        color: Colors.uaBlue,
        startHour: 13,
        startMinute: 0,
        duration: 60 // 1 hour
      },
      { 
        id: '6', 
        title: 'Fitness Assessment', 
        time: '3:00 PM', 
        type: '1 on 1', 
        color: Colors.uaGreen,
        startHour: 15,
        startMinute: 0,
        duration: 60 // 1 hour
      },
    ],
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const HOUR_HEIGHT = 60; // Height for each hour in pixels
  const START_HOUR = 6; // Start displaying from 6 AM
  const END_HOUR = 22; // End at 10 PM
  const DISPLAY_HOURS = END_HOUR - START_HOUR;

  useEffect(() => {
    generateWeekData();
  }, [currentWeekStart]);

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const generateWeekData = () => {
    const startOfWeek = getStartOfWeek(currentWeekStart);
    const today = new Date();
    const week: DayData[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      
      const dateKey = currentDay.toISOString().split('T')[0];
      const isToday = 
        currentDay.getDate() === today.getDate() &&
        currentDay.getMonth() === today.getMonth() &&
        currentDay.getFullYear() === today.getFullYear();

      week.push({
        date: currentDay,
        dayName: dayNames[i],
        dayNumber: currentDay.getDate(),
        isToday,
        events: sampleEvents[dateKey] || [],
      });
    }

    setWeekData(week);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentWeekStart(newDate);
  };

  const formatTime = (hour: number) => {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
  };

  const getWeekRange = () => {
    const startOfWeek = getStartOfWeek(currentWeekStart);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short' });
    const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short' });
    const year = startOfWeek.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${startOfWeek.getDate()}-${endOfWeek.getDate()}, ${year}`;
    } else {
      return `${startMonth} ${startOfWeek.getDate()} - ${endMonth} ${endOfWeek.getDate()}, ${year}`;
    }
  };

  const getEventPosition = (event: CalendarEvent) => {
    // Calculate position relative to START_HOUR
    const totalMinutesFromStart = (event.startHour - START_HOUR) * 60 + event.startMinute;
    const topPercentage = (totalMinutesFromStart / (DISPLAY_HOURS * 60)) * 100;
    const heightPercentage = (event.duration / (DISPLAY_HOURS * 60)) * 100;
    
    return {
      top: `${Math.max(0, topPercentage)}%`,
      height: `${Math.max(2, heightPercentage)}%`, // Minimum 2% height
    };
  };

  const renderDayColumn = (day: DayData, dayIndex: number) => (
    <View key={dayIndex} className="flex-1 relative border-l border-gray-200">
      {/* Hour grid lines */}
      {Array.from({ length: DISPLAY_HOURS + 1 }, (_, i) => (
        <View
          key={i}
          className="absolute left-0 right-0 border-t border-gray-100"
          style={{ top: `${(i / DISPLAY_HOURS) * 100}%` }}
        />
      ))}
      
      {/* Events */}
      {day.events.map((event) => {
        const position = getEventPosition(event);
        return (
          <TouchableOpacity
            key={event.id}
            className="absolute left-1 right-1 rounded-md p-2 border-l-4"
            style={{
              top: parseFloat(position.top),
              height: parseFloat(position.height),
              backgroundColor: event.color + '20',
              borderLeftColor: event.color,
              minHeight: 40, // Ensure minimum touchable area
            }}
            onPress={() => setSelectedEvent(event)}
          >
            <Text className="text-xs font-semibold text-gray-800" numberOfLines={1}>
              {event.title}
            </Text>
            <Text className="text-xs text-gray-600" numberOfLines={1}>
              {event.time}
            </Text>
          </TouchableOpacity>
        );
      })}    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-3">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity
            onPress={() => navigateWeek('prev')}
            className="p-2 rounded-full"
          >
            <Ionicons name="chevron-back" size={24} style={{ color: Colors.uaBlue }} />
          </TouchableOpacity>
          
          <Text className="text-lg font-bold text-gray-900">
            {getWeekRange()}
          </Text>
          
          <TouchableOpacity
            onPress={() => navigateWeek('next')}
            className="p-2 rounded-full"
          >
            <Ionicons name="chevron-forward" size={24} style={{ color: Colors.uaBlue }} />
          </TouchableOpacity>
        </View>

        {/* Day headers */}
        <View className="flex-row">
          <View className="w-16" />
          {weekData.map((day, index) => (
            <View key={index} className="flex-1 items-center">
              <Text className="text-sm font-medium text-gray-600">
                {day.dayName}
              </Text>
              <View className={`w-8 h-8 rounded-full items-center justify-center mt-1`}
                style={day.isToday ? { backgroundColor: Colors.uaBlue } : {}}
              >
                <Text className={`text-sm font-semibold ${
                  day.isToday ? 'text-white' : 'text-gray-900'
                }`}>
                  {day.dayNumber}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Calendar Grid */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-row bg-white mx-2 mt-2 rounded-lg shadow-sm border border-gray-200">
          {/* Time labels */}
          <View className="w-16">
            {Array.from({ length: DISPLAY_HOURS }, (_, i) => {
              const hour = START_HOUR + i;
              return (
                <View
                  key={hour}
                  className="justify-start pt-2 pr-2"
                  style={{ height: HOUR_HEIGHT }}
                >
                  <Text className="text-xs text-gray-500 text-right">
                    {formatTime(hour)}
                  </Text>
                </View>
              );
            })}
          </View>
          
          {/* Day columns container */}
          <View className="flex-1 flex-row" style={{ height: DISPLAY_HOURS * HOUR_HEIGHT }}>
            {weekData.map(renderDayColumn)}
          </View>
        </View>
        
        <View className="h-4" />
      </ScrollView>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <TouchableOpacity
          className="absolute inset-0 bg-black bg-opacity-50 justify-center items-center"
          onPress={() => setSelectedEvent(null)}
        >
          <View className="bg-white rounded-lg p-6 mx-6 w-80">
            <View className="flex-row items-center mb-4">
              <View
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: selectedEvent.color }}
              />
              <Text className="text-lg font-bold text-gray-900 flex-1">
                {selectedEvent.title}
              </Text>
              <TouchableOpacity onPress={() => setSelectedEvent(null)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View className="space-y-2">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text className="ml-2 text-gray-600">{selectedEvent.time}</Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="bookmark-outline" size={16} color="#6B7280" />
                <Text className="ml-2 text-gray-600 capitalize">{selectedEvent.type}</Text>
              </View>
            </View>
            
            <TouchableOpacity
              className="mt-4 py-3 px-4 rounded-lg"
              style={{ backgroundColor: Colors.uaBlue }}
            >
              <Text className="text-white text-center font-semibold">View Details</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      {/* Legend */}
      <View className="bg-white mx-2 mb-2 p-4 rounded-lg shadow-sm border border-gray-200">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Event Types</Text>
        <View className="flex-row flex-wrap">
          <View className="flex-row items-center mr-4 mb-2">
            <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: Colors.uaGreen }} />
            <Text className="text-sm text-gray-600">1 on 1 Sessions</Text>
          </View>
          <View className="flex-row items-center mr-4 mb-2">
            <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: Colors.uaBlue }} />
            <Text className="text-sm text-gray-600">Group Events</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
