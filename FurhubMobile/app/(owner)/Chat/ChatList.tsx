import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

// Mock data structure, replace with backend API
const mockChats = [
  {
    id: "chat1",
    name: "John Walker",
    avatar: "https://i.pravatar.cc/150?img=1",
    lastMessage: "See you tomorrow!",
    unread: 2,
    lastUpdated: "10:45 AM",
  },
  {
    id: "chat2",
    name: "Anna Smith",
    avatar: "https://i.pravatar.cc/150?img=2",
    lastMessage: "Thanks for the update",
    unread: 0,
    lastUpdated: "Yesterday",
  },
];

export default function ChatList() {
  const [chats, setChats] = useState(mockChats);
  const router = useRouter();

  // Fetch chats from backend API here
  useEffect(() => {
    // fetchChats().then(setChats);
  }, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/Chat/IndividualChat?chatId=${item.id}&name=${item.name}`)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unread}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 15 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  name: { fontSize: 16, fontWeight: "600", color: "#34495E" },
  lastMessage: { fontSize: 13, color: "#777", marginTop: 2 },
  unreadBadge: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  unreadText: { color: "#fff", fontSize: 12, fontWeight: "700" },
});
