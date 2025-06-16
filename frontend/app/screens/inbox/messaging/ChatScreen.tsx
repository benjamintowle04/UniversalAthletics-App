import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../contexts/UserContext';
import { sendMessage } from '../../../../controllers/MessageController';
import { Colors } from '../../../themes/colors/Colors';
import { NavigationProp, RouteProp } from '@react-navigation/native';

// Define the params for this screen
type ChatScreenRouteParams = {
    conversationId: string;
    otherParticipant: {
        id: string;
        type: 'COACH' | 'MEMBER';
        name: string;
        profilePic?: string;
        firebaseId: string;
    };
};

interface ChatScreenProps {
    navigation: NavigationProp<any>;
    route: RouteProp<{ ChatScreen: ChatScreenRouteParams }, 'ChatScreen'>;
}
const ChatScreen = ({ navigation, route }: ChatScreenProps) => {
  const { conversationId, otherParticipant } = route.params;
  const { userData } = useUser();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userData || sending) return;

    setSending(true);
    try {
      await sendMessage(
        conversationId,
        userData.id.toString(),
        'MEMBER', // Assuming current user is always MEMBER for now
        `${userData.firstName} ${userData.lastName}`,
        userData.profilePic,
        otherParticipant.id,
        otherParticipant.type,
        newMessage.trim()
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMyMessage = item.senderId === userData?.id.toString();
    
    return (
      <View className={`mb-3 ${isMyMessage ? 'items-end' : 'items-start'}`}>
        <View 
          className={`max-w-[80%] p-3 rounded-lg ${
            isMyMessage ? 'bg-blue-500' : 'bg-gray-200'
          }`}
        >
          <Text className={`${isMyMessage ? 'text-white' : 'text-gray-900'}`}>
            {item.content}
          </Text>
          <Text className={`text-xs mt-1 ${isMyMessage ? 'text-blue-100' : 'text-gray-500'}`}>
            {new Date(item.timestamp?.toDate()).toLocaleTimeString()}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="p-4 border-b border-gray-200">
        <Text className="text-lg font-semibold">{otherParticipant.name}</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4"
        inverted
      />

      {/* Input */}
      <View className="flex-row items-center p-4 border-t border-gray-200">
        <TextInput
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2"
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={!newMessage.trim() || sending}
          className="p-2 rounded-full"
          style={{ backgroundColor: Colors.uaBlue }}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
