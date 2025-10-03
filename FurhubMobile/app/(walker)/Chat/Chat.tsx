import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { mockChats } from "@/services/chat/mockChats";

export default function Chat() {
  const router = useRouter();
  const [chats] = useState(mockChats);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>💬 Messages</Text>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/Chat/IndividualChat/${item.id}`)}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.name}>{item.userName}</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F9F8F9" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 15, color: "#34495E" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  name: { fontSize: 16, fontWeight: "600" },
  lastMessage: { color: "#777", marginTop: 2 },
});
