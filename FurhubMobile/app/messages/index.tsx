import React, { useEffect, useState, useMemo } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert } from "react-native";
import { listConversations, getOrCreateConversation } from "../../services/messages";
import type { Conversation } from "../../types/messaging";
import ConversationRow from "../../components/messages/ConversationRow";

export default function ConversationListScreen() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Conversation[]>([]);
  const router = useRouter();

  useEffect(() => {
    listConversations(query).then((res) => setItems(res.results));
  }, [query]);

  useFocusEffect(
    React.useCallback(() => {
      // refresh when screen gains focus
      listConversations(query).then((res) => setItems(res.results));
    }, [query])
  );

  const handleStartConversation = async (otherUserId: number) => {
    try {
      const conversation = await getOrCreateConversation(otherUserId);
      router.push(`/messages/${conversation.conversation_id}`);
    } catch (error) {
      Alert.alert("Error", "Failed to start conversation");
    }
  };

  const content = useMemo(() => items, [items]);

  return (
    <View className="flex-1 bg-[#f4fbf3]">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-semibold text-[#1f2d1e]">MessageHub</Text>
        <View className="mt-3 bg-white rounded-xl border border-[#e5e7eb]">
          <TextInput
            placeholder="Search conversations..."
            value={query}
            onChangeText={setQuery}
            className="px-4 py-3 text-base"
          />
        </View>
      </View>

      <FlatList
        data={content}
        keyExtractor={(item) => String(item.conversation_id)}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item, index }) => (
          <ConversationRow item={item} highlighted={index === 0} />
        )}
      />
    </View>
  );
}


