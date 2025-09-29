export type ConversationId = number;
export type UserId = number;
export type MessageId = number;

export interface Conversation {
  conversation_id: ConversationId;
  user1_id: UserId;
  user2_id: UserId;
  last_message?: string | null;
  last_sent_at?: string | null; // ISO string
  unread_count?: number;
  // Optional UI helpers
  other_user_name?: string;
  other_user_avatar_url?: string;
  // NEW: track who sent the last message
  last_message_sender_id?: UserId;
}

export interface Message {
  message_id: MessageId;
  conversation_id: ConversationId;
  content: string | null;
  sent_at: string; // ISO string
  is_read: boolean;
  sender_id: UserId;
}

export interface PaginatedResult<T> {
  results: T[];
  next?: string | null;
  previous?: string | null;
}


