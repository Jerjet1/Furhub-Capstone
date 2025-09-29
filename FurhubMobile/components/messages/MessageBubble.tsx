import { View, Text, Pressable, Alert } from "react-native";
import type { Message } from "../../types/messaging";

type Props = {
  message: Message;
  isMe: boolean;
  onEdit?: (messageId: number, currentContent: string) => void;
  onDelete?: (messageId: number) => void;
  canDelete?: boolean;
  // NEW: show status only on your latest message
  isLastOwn?: boolean;
};

export default function MessageBubble({ message, isMe, onEdit, onDelete, canDelete, isLastOwn }: Props) {
  const container = isMe ? "items-end" : "items-start";
  const bubble = isMe ? "bg-[#a3b84e]" : "bg-gray-100";
  const textColor = isMe ? "text-black" : "text-gray-800";
  const radius = isMe ? "rounded-t-2xl rounded-l-2xl rounded-br-md" : "rounded-t-2xl rounded-r-2xl rounded-bl-md";

  const time = new Date(message.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  function confirmDelete() {
    if (!canDelete || !onDelete) return;
    Alert.alert(
      "Delete message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => onDelete && onDelete(message.message_id) },
      ]
    );
  }

  function openMenu() {
    const actions: any[] = [
      { text: "Cancel", style: "cancel" },
      { text: "Edit", onPress: () => onEdit && onEdit(message.message_id, message.content || "") },
    ];
    if (canDelete) actions.push({ text: "Delete", style: "destructive", onPress: () => confirmDelete() });
    Alert.alert("Message", undefined, actions);
  }

  return (
    <View className={`mb-2 px-2 ${container}`}>
      <View className={`flex-row items-start ${isMe ? "justify-end" : "justify-start"}`}>
        {!isMe && (
          <Pressable onPress={openMenu} className="px-2 py-1">
            <Text className="text-gray-400 text-lg">⋮</Text>
          </Pressable>
        )}
        <View className={`${bubble} px-3 py-2 max-w-[80%] ${radius}`}>
          <Text className={`${textColor}`}>{message.content}</Text>
          <Text className={`mt-1 text-[10px] ${isMe ? "text-black/60" : "text-gray-500"}`}>
            {time}
            {isMe && isLastOwn ? ` • ${message.is_read ? "Seen" : "Sent"}` : ""}
          </Text>
        </View>
        {isMe && (
          <Pressable onPress={openMenu} className="px-2 py-1">
            <Text className="text-gray-400 text-lg">⋮</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}


