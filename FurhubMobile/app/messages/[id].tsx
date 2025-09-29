import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import MessageBubble from "../../components/messages/MessageBubble";
import {
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
  markConversationRead,
  listConversations
} from "../../services/messages";
import type { Message } from "../../types/messaging";

export default function ConversationScreen() {
  const { id } = useLocalSearchParams();
  const conversationId = Number(id);
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [headerTitle, setHeaderTitle] = useState("Conversation");
  const [participants, setParticipants] = useState<{ user1_id: number; user2_id: number } | null>(null);

  const flatRef = useRef<FlatList>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [msgsRes, convs] = await Promise.all([getMessages(conversationId), listConversations()]);
      setMessages(msgsRes.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()));
      const meta = convs.results.find(c => c.conversation_id === conversationId);
      if (meta?.other_user_name) setHeaderTitle(meta.other_user_name);
      if (meta?.user1_id && meta?.user2_id) {
        setParticipants({ user1_id: meta.user1_id, user2_id: meta.user2_id });
      }
      await markConversationRead(conversationId);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    if (!isNaN(conversationId)) load();
  }, [conversationId, load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function startEdit(messageId: number, currentContent: string) {
    setEditingId(messageId);
    setInput(currentContent);
  }

  async function handleDelete(messageId: number) {
    await deleteMessage(conversationId, messageId);
    setMessages(m => m.filter(x => x.message_id !== messageId));
  }

  async function handleSend() {
    if (!input.trim() || !participants) return;
    setSending(true);
    try {
      if (editingId) {
        const updated = await updateMessage(conversationId, editingId, input.trim());
        setMessages(m => m.map(x => (x.message_id === editingId ? updated : x)));
        setEditingId(null);
        setInput("");
      } else {
        const senderId = participants.user1_id;
        const newMsg = await sendMessage(conversationId, input.trim(), senderId);
        setMessages(m => [...m, newMsg]);
        setInput("");
      }
      requestAnimationFrame(() => flatRef.current?.scrollToEnd({ animated: true }));
    } finally {
      setSending(false);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setInput("");
  }

  const renderItem = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item}
      isMe={!!participants && item.sender_id === participants.user1_id}
      onEdit={startEdit}
      onDelete={handleDelete}
      canDelete={!!participants && item.sender_id === participants.user1_id}
    />
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, backgroundColor: "#f4fbf3" }}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="pr-4 py-2">
          <Text className="text-xl text-gray-600">‹</Text>
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-[#1f2d1e] flex-1" numberOfLines={1}>{headerTitle}</Text>
      </View>

      {/* Messages */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#6b7280" />
        </View>
      ) : (
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(item) => String(item.message_id)}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      {/* Composer */}
      <View className="bg-white border-t border-gray-200 px-3 pt-2 pb-4">
        {editingId && (
          <View className="flex-row items-center mb-2">
            <Text className="text-xs text-gray-600 flex-1">Editing message…</Text>
            <TouchableOpacity onPress={cancelEdit} className="px-2 py-1">
              <Text className="text-xs text-red-500 font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        <View className="flex-row items-end">
          <TextInput
            className="flex-1 bg-gray-100 rounded-xl px-3 py-2 text-sm mr-2"
            placeholder={editingId ? "Edit your message…" : "Type a message…"}
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity
            disabled={sending || !input.trim()}
            onPress={handleSend}
            className={`px-4 py-3 rounded-xl ${input.trim() ? "bg-[#a3b84e]" : "bg-gray-300"}`}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#1f2d1e" />
            ) : (
              <FontAwesome name={editingId ? "save" : "send"} size={16} color={input.trim() ? "#1f2d1e" : "#6b7280"} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
