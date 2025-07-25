import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios'
import { API_URL } from '@/services/api';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import socket from '@/services/socket';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  currentUser: {
    id: number;
    role: 'owner' | 'walker';
    name: string;
  };
};

type ChatMessage = {
  sender: string;
  senderId: number;
  message: string;
  timestamp: Date;
};

type Contact = {
  id: number;
  name: string;
  role: 'owner' | 'walker';
  isOnline: boolean;
  unreadCount: number;
  roomId?: number;
};

const ChatScreen = ({ currentUser }: Props) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Temporary contacts for testing
  const tempContacts: Contact[] = [
    {
      id: 2,
      name: 'John Walker',
      role: 'walker',
      isOnline: true,
      unreadCount: 0
    },
    {
      id: 3,
      name: 'Sarah Owner',
      role: 'owner',
      isOnline: true,
      unreadCount: 0
    },
    {
      id: 4,
      name: 'Mike Walker',
      role: 'walker',
      isOnline: false,
      unreadCount: 0
    }
  ];

  useEffect(() => {
    // Initialize with temporary contacts
    setContacts(tempContacts.filter(contact => contact.id !== currentUser.id));

    socket.connect();

    // Initialize with current user's info
    socket.emit('register', {
      id: currentUser.id,
      name: currentUser.name,
      role: currentUser.role,
    });

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');
    });

    socket.on('contacts', (contactsList: Contact[]) => {
      // Merge temporary contacts with live contacts
      const mergedContacts = [...tempContacts, ...contactsList]
        .filter(contact => contact.id !== currentUser.id)
        .reduce((acc, contact) => {
          if (!acc.some(c => c.id === contact.id)) {
            acc.push(contact);
          }
          return acc;
        }, [] as Contact[]);
      
      setContacts(mergedContacts.map(contact => ({
        ...contact,
        unreadCount: contact.id === selectedContact?.id ? 0 : contact.unreadCount || 0
      })));
    });

    socket.on('message', (event) => {
      const parsed = typeof event === 'string' ? JSON.parse(event) : event;
      const { message: incoming, sender, senderId, roomId } = parsed;
    
      const isFromSelectedContact = selectedContact?.roomId === roomId;
    
      const newMessage: ChatMessage = { 
        sender, 
        senderId,
        message: incoming, 
        timestamp: new Date() 
      };
    
      setMessages(prev => ({
        ...prev,
        [roomId]: [...(prev[roomId] || []), newMessage]
      }));
    
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    
      if (!isFromSelectedContact) {
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.roomId === roomId 
              ? { ...contact, unreadCount: (contact.unreadCount || 0) + 1 } 
              : contact
          )
        );
    
        Alert.alert(`New message from ${sender}`, incoming);
      }
    });

    socket.on('user-online', (userId: number) => {
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === userId ? { ...contact, isOnline: true } : contact
        )
      );
    });

    socket.on('user-offline', (userId: number) => {
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === userId ? { ...contact, isOnline: false } : contact
        )
      );
    });

    return () => {
      socket.disconnect();
      socket.off('message');
      socket.off('contacts');
      socket.off('user-online');
      socket.off('user-offline');
    };
  }, [selectedContact]);

  const sendMessage = () => {
    if (message.trim() && selectedContact) {
      const payload = JSON.stringify({
        roomId: selectedContact.roomId,
        message,
        sender: currentUser.name ?? currentUser.role,
        senderId: currentUser.id,
        recipientId: selectedContact.id,
      });
      socket.send(payload);
      
      const newMessage: ChatMessage = { 
        sender: currentUser.name ?? currentUser.role,
        senderId: currentUser.id,
        message,
        timestamp: new Date()
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage]
      }));
      setMessage('');
      
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const selectContact = async (contact: Contact) => {
    setSelectedContact(contact);
  
    // ✅ FETCH message history from backend
    try {
      const res = await axios.post(`${API_URL}chatrooms/get-or-create/`, {
        user2_id: contact.id,
      });
  
      const roomId = res.data.room_id;
      
      // Join socket room
      socket.emit("joinRoom", roomId);
  
      // Fetch messages
      const messageRes = await axios.get(`${API_URL}chat/messages/?room=${roomId}`);
      const history: ChatMessage[] = messageRes.data.map((msg: any) => ({
        sender: msg.sender_name || msg.sender,
        senderId: msg.sender,
        message: msg.content,
        timestamp: new Date(msg.timestamp),
      }));
  
      // Store by roomId
      setMessages(prev => ({
        ...prev,
        [roomId]: history,
      }));
  
      // Set selected contact and assign roomId to it
      setSelectedContact({ ...contact, roomId });
  
      setContacts(prev =>
        prev.map(c => (c.id === contact.id ? { ...c, roomId, unreadCount: 0 } : c))
      );
  
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error("❌ Failed to fetch or create chat room:", error);
    }
  };
  
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      {/* Contacts List */}
      <View className="p-4 border-b border-gray-200 max-h-36">
        <Text className="text-base font-bold text-gray-600 mb-2">Contacts</Text>
        <FlatList
          horizontal
          data={contacts}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className={`
                w-28 p-3 mr-3 rounded-lg bg-gray-50 border 
                ${selectedContact?.id === item.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                ${!item.isOnline ? 'opacity-60' : ''}
              `}
              onPress={() => selectContact(item)}
            >
              <View className="mb-1">
                <Text className="font-bold text-sm">{item.name}</Text>
                <Text className="text-xs text-gray-500">{item.role}</Text>
                <View className="flex-row items-center mt-1">
                  <View 
                    className={`
                      w-2 h-2 rounded-full mr-1
                      ${item.isOnline ? 'bg-green-500' : 'bg-red-500'}
                    `} 
                  />
                  <Text className="text-xs text-gray-500">
                    {item.isOnline ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </View>
              {item.unreadCount > 0 && (
                <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 justify-center items-center">
                  <Text className="text-white text-xs font-bold">{item.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 8 }}
        />
      </View>

      {/* Chat Area */}
      <View className="flex-1">
        {selectedContact ? (
          <>
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-lg font-bold">
                Chat with {selectedContact.name} ({selectedContact.role})
              </Text>
              <View className="flex-row items-center">
                <View 
                  className={`
                    w-2 h-2 rounded-full mr-1
                    ${selectedContact.isOnline ? 'bg-green-500' : 'bg-red-500'}
                  `} 
                />
                <Text className="text-sm text-gray-500">
                  {selectedContact.isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
            </View>

            <FlatList
              ref={flatListRef}
              data={messages[selectedContact.id] || []}
              renderItem={({ item }) => {
                const isMe = item.senderId === currentUser.id;
                return (
                  <View
                    className={`
                      p-3 rounded-xl mb-2 max-w-[80%]
                      ${isMe ? 'self-end bg-blue-500' : 'self-start bg-gray-100'}
                    `}
                  >
                    <Text
                      className={`
                        text-base
                        ${isMe ? 'text-white' : 'text-black'}
                      `}
                    >
                      <Text className="font-bold">{item.sender}:</Text>{' '}
                      {item.message}
                    </Text>
                    <Text 
                      className={`
                        text-xs mt-1
                        ${isMe ? 'text-blue-100' : 'text-gray-500'}
                      `}
                    >
                      {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                );
              }}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={{ padding: 16, flexGrow: 1 }}
            />

            <View className="p-4 border-t border-gray-200 flex-row">
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder={`Message ${selectedContact.name}...`}
                className={`
                  flex-1 border rounded-full px-4 py-2 mr-2
                  ${selectedContact.isOnline ? 'border-gray-300' : 'border-gray-200 bg-gray-100'}
                `}
                onSubmitEditing={sendMessage}
                editable={selectedContact.isOnline}
              />
              <TouchableOpacity 
                className={`
                  w-12 h-12 rounded-full justify-center items-center
                  ${selectedContact.isOnline ? 'bg-blue-500' : 'bg-gray-400'}
                `} 
                onPress={sendMessage}
                disabled={!selectedContact.isOnline}
              >
                <FontAwesome name="send" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-lg text-gray-500">Select a contact to start chatting</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;