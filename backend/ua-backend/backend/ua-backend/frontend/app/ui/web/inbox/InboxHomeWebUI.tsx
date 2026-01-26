import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Modal, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../themes/colors/Colors';

interface InboxHomeWebUIProps {
  userData: any;
  connectionRequests: any[];
  sessionRequests: any[];
  conversations: any[];
  processingRequests: Set<number>;
  showCoachModal: boolean;
  creatingConversation: boolean;
  setShowCoachModal: (show: boolean) => void;
  renderConnectionRequest: (request: any, index: number) => React.ReactNode;
  renderSessionRequest: (request: any, index: number) => React.ReactNode;
  renderRegularMessage: (conversation: any, index: number) => React.ReactNode;
  handleStartConversation: (coach: any) => void;
  renderCoachItem: ({ item }: { item: any }) => React.ReactNode;
}

const InboxHomeWebUI: React.FC<InboxHomeWebUIProps> = ({
  userData,
  connectionRequests,
  sessionRequests,
  conversations,
  processingRequests,
  showCoachModal,
  creatingConversation,
  setShowCoachModal,
  renderConnectionRequest,
  renderSessionRequest,
  renderRegularMessage,
  handleStartConversation,
  renderCoachItem
}) => {
  const renderCategorySection = (
    title: string, 
    count: number, 
    icon: string, 
    color: string,
    items: any[], 
    renderItem: (item: any, index: number) => React.ReactNode
  ) => (
    <View className="mb-8">
      {/* Category Header */}
      <View 
        className="rounded-xl p-6 mb-4 shadow-sm"
        style={{ backgroundColor: color }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center mr-4">
              <Ionicons name={icon as any} size={24} color={color} />
            </View>
            <Text className="text-white font-bold text-xl">{title}</Text>
          </View>
          <View className="bg-white rounded-full px-4 py-2">
            <Text className="font-bold text-lg" style={{ color: color }}>
              {count}
            </Text>
          </View>
        </View>
      </View>
      
      {/* Category Items */}
      {items.length > 0 ? (
        <View className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((item, index) => (
            <View key={item.id || index} className="col-span-1">
              {renderItem(item, index)}
            </View>
          ))}
        </View>
      ) : (
        <View className="bg-white rounded-xl p-8 items-center shadow-sm border border-gray-100">
          <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
          <Text className="text-gray-500 text-center mt-4 font-semibold text-lg">
            No {title.toLowerCase()} at the moment
          </Text>
          <Text className="text-gray-400 text-center text-base mt-2">
            You're all caught up!
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="web-container py-8 px-4">
        <View className="web-card bg-white p-8 max-w-6xl mx-auto rounded-xl shadow-lg">
          
          {/* Header */}
          <View className="mb-8">
            <Text className="text-gray-900 text-4xl font-bold mb-3">
              Your Inbox
            </Text>
            <Text className="text-gray-600 text-xl">
              Stay updated with your latest notifications and messages
            </Text>
          </View>

          {/* Stats Overview Cards */}
          <View className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <View className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-blue-100 text-sm font-medium">Connection Requests</Text>
                  <Text className="text-white text-3xl font-bold mt-1">
                    {connectionRequests.length}
                  </Text>
                </View>
                <View className="bg-white bg-opacity-20 p-3 rounded-full">
                  <Ionicons name="people" size={24} color="white" />
                </View>
              </View>
            </View>

            <View className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl text-white">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-red-100 text-sm font-medium">Session Requests</Text>
                  <Text className="text-white text-3xl font-bold mt-1">
                    {sessionRequests.length}
                  </Text>
                </View>
                <View className="bg-white bg-opacity-20 p-3 rounded-full">
                  <Ionicons name="calendar" size={24} color="white" />
                </View>
              </View>
            </View>

            <View className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-green-100 text-sm font-medium">Active Conversations</Text>
                  <Text className="text-white text-3xl font-bold mt-1">
                    {conversations.length}
                  </Text>
                </View>
                <View className="bg-white bg-opacity-20 p-3 rounded-full">
                  <Ionicons name="chatbubble" size={24} color="white" />
                </View>
              </View>
            </View>
          </View>
          
          {/* Connection Requests Section */}
          {renderCategorySection(
            "Connection Requests",
            connectionRequests.length,
            "people",
            Colors.uaBlue,
            connectionRequests,
            renderConnectionRequest
          )}

          {/* Session Requests Section */}
          {renderCategorySection(
            "Session Requests",
            sessionRequests.length,
            "calendar",
            Colors.uaRed,
            sessionRequests,
            renderSessionRequest
          )}

          {/* Regular Messages Section */}
          {renderCategorySection(
            "Messages",
            conversations.length,
            "chatbubble",
            Colors.uaGreen,
            conversations,
            renderRegularMessage
          )}

          {/* New Message Button */}
          <View className="mt-8">
            <TouchableOpacity 
              className="bg-white rounded-xl p-6 shadow-sm border-2 flex-row items-center justify-center hover:bg-gray-50 transition-colors"
              onPress={() => setShowCoachModal(true)}
              style={{ borderColor: Colors.uaGreen }}
            >
              <Ionicons name="add-circle-outline" size={28} color={Colors.uaGreen} />
              <Text className="ml-3 font-bold text-xl" style={{ color: Colors.uaGreen }}>
                Start New Conversation
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>

      {/* Coach Selection Modal */}
      <Modal
        visible={showCoachModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCoachModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 p-4">
          <View className="bg-white rounded-xl max-w-2xl w-full max-h-96 shadow-2xl">
            {/* Modal Header */}
            <View className="p-6 border-b border-gray-200 flex-row items-center justify-between">
              <Text className="text-2xl font-bold">Select a Coach</Text>
              <TouchableOpacity 
                onPress={() => setShowCoachModal(false)}
                disabled={creatingConversation}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Ionicons name="close" size={28} color={Colors.grey.dark} />
              </TouchableOpacity>
            </View>
            
            {/* Coach List */}
            {userData?.connections && userData.connections.length > 0 ? (
              <FlatList
                data={userData.connections}
                renderItem={(props) => renderCoachItem(props) as React.ReactElement}
                keyExtractor={(item) => item.id.toString()}
                className="max-h-80"
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View className="p-12 items-center">
                <Ionicons name="people-outline" size={64} color={Colors.grey.medium} />
                <Text className="text-gray-500 text-center mt-4 font-semibold text-lg">
                  No Connected Coaches
                </Text>
                <Text className="text-gray-400 text-center text-base mt-2">
                  Connect with coaches first to start conversations
                </Text>
              </View>
            )}
            
            {creatingConversation && (
              <View className="absolute inset-0 bg-white bg-opacity-90 items-center justify-center rounded-xl">
                <View className="bg-white p-6 rounded-lg shadow-lg items-center">
                  <Text className="text-gray-600 text-lg font-medium">Starting conversation...</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default InboxHomeWebUI;
