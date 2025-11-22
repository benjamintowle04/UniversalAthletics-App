import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../contexts/UserContext';
import { sendMessage, getMessagesForConversation, markMessagesAsRead } from '../../../../controllers/MessageController';
import { Colors } from '../../../themes/colors/Colors';
import { NavigationProp, RouteProp } from '@react-navigation/native';
import { getFirebaseAuthSafe } from '../../../../firebase_config';

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
  const [loading, setLoading] = useState(true);

  const auth = getFirebaseAuthSafe();

  // Mark messages as read immediately when screen loads
  useEffect(() => {
    const markAsReadImmediately = async () => {
      if (conversationId && auth?.currentUser) {
        console.log('Marking messages as read for conversation:', conversationId);
        await markMessagesAsRead(conversationId, auth.currentUser.uid);
      }
    };

    markAsReadImmediately();
  }, [conversationId, auth]);

  // Set up messages listener
  useEffect(() => {
    if (!conversationId) {
      console.error('No conversation ID provided');
      return;
    }

    console.log('Setting up messages listener for:', conversationId);
    setLoading(true);

    const unsubscribe = getMessagesForConversation(
      conversationId,
      (messageList) => {
        console.log('Received messages update:', messageList.length);
        setMessages(messageList);
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up messages listener');
      unsubscribe();
    };
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userData || sending) {
      console.log('Cannot send message:', { 
        hasMessage: !!newMessage.trim(), 
        hasUser: !!userData, 
        sending 
      });
      return;
    }

    // Check if user is authenticated with Firebase
    if (!auth?.currentUser) {
      Alert.alert('Authentication Error', 'Please log in again to send messages.');
      return;
    }

    setSending(true);
    const messageToSend = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

    try {
      await sendMessage(
        conversationId,
  auth.currentUser.uid, // Use Firebase UID instead of userData.id
        'MEMBER', // Assuming current user is always MEMBER for now
        `${userData.firstName} ${userData.lastName}`,
        userData.profilePic,
        otherParticipant.firebaseId, // Use Firebase UID for receiver
        otherParticipant.type,
        messageToSend
      );
      
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Restore message text on error
      setNewMessage(messageToSend);
      
      // Show user-friendly error
      Alert.alert(
        'Message Failed',
        'Unable to send message. Please check your connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: any }) => {
    // Compare with Firebase UID instead of userData.id
  const isMyMessage = item.senderId === auth?.currentUser?.uid;
    
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
            {item.timestamp?.toDate ? 
              new Date(item.timestamp.toDate()).toLocaleTimeString() :
              'Sending...'
            }
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500">Loading messages...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="p-4 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mr-3"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.uaBlue} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-semibold">{otherParticipant.name}</Text>
          <Text className="text-sm text-gray-500">
            {messages.length} messages
          </Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        className="flex-1 px-4"
        inverted
        ListEmptyComponent={
          <View className="items-center justify-center p-8">
            <Ionicons name="chatbubble-outline" size={64} color={Colors.grey.medium} />
            <Text className="text-gray-500 mt-4">No messages yet</Text>
            <Text className="text-gray-400 text-sm mt-1">Start the conversation!</Text>
          </View>
        }
      />

      {/* Input */}
      <View className="flex-row items-center p-4 border-t border-gray-200">
        <TextInput
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2"
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          editable={!sending}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={!newMessage.trim() || sending}
          className={`p-2 rounded-full ${
            (!newMessage.trim() || sending) ? 'opacity-50' : ''
          }`}
          style={{ backgroundColor: Colors.uaBlue }}
        >
          <Ionicons 
            name={sending ? "hourglass" : "send"} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
