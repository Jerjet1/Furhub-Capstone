import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface Message {
  id: string;
  text: string;
  sender: "owner" | "walker";
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hi! Is your dog ready for the walk?", sender: "walker" },
    { id: "2", text: "Yes, he’s ready 🐶", sender: "owner" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage: Message = { id: Date.now().toString(), text: input, sender: "owner" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#F9F8F9" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 15 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.message,
              item.sender === "owner" ? styles.owner : styles.walker,
            ]}
          >
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <FontAwesome5 name="paper-plane" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  message: {
    maxWidth: "70%",
    padding: 14,
    borderRadius: 20,
    marginBottom: 10,
  },
  owner: { backgroundColor: "#007AFF", alignSelf: "flex-end", borderBottomRightRadius: 0 },
  walker: { backgroundColor: "#E5E5EA", alignSelf: "flex-start", borderBottomLeftRadius: 0 },
  text: { color: "#fff", fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 25,
    marginLeft: 10,
  },
});
