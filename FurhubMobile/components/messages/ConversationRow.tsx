import { View, Text, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import type { Conversation } from "../../types/messaging";

// Smaller relative time helper with the same output
function getRelativeTime(iso?: string | null): string {
  if (!iso) return "";
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

type Props = {
  item: Conversation;
  highlighted?: boolean;
};

export default function ConversationRow({ item, highlighted }: Props) {
  const containerClasses = highlighted
    ? "mb-3 rounded-xl border bg-[#a3b84e] border-[#889e3b] px-3 py-3"
    : "mb-3 rounded-xl border bg-white border-[#e5e7eb] px-3 py-3";
  const titleColor = highlighted ? "text-white" : "text-[#111827]";
  const subTextColor = highlighted ? "text-white" : "text-gray-500";
  const previewColor = highlighted ? "text-white" : "text-gray-700";
  const badgeBg = highlighted ? "bg-[#6a7f00]" : "bg-[#a3b84e]";
  const badgeText = highlighted ? "text-white" : "text-black";

  return (
    <Link href={`/messages/${item.conversation_id}`} asChild>
      <Pressable className={containerClasses}>
        <View className="flex-row items-center">
          <Image
            source={{ uri: item.other_user_avatar_url || undefined }}
            className="h-12 w-12 rounded-full mr-3"
          />
          <View className="flex-1">
            <View className="flex-row justify-between items-center">
              <Text className={`font-semibold ${titleColor}`}>
                {item.other_user_name || "Unknown"}
              </Text>
              <Text className={`text-xs ${subTextColor}`}>{getRelativeTime(item.last_sent_at)}</Text>
            </View>
            <Text numberOfLines={1} className={`mt-1 ${previewColor}`}>
              {item.last_message}
            </Text>
          </View>
          {!!item.unread_count && (
            <View className={`ml-2 rounded-full px-2 py-1 ${badgeBg}`}>
              <Text className={`text-xs font-semibold ${badgeText}`}>{item.unread_count}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Link>
  );
}


