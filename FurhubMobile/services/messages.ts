import { Conversation, ConversationId, Message, PaginatedResult } from "../types/messaging";
import { axiosInstance } from "./axiosInterceptor";
import { MESSAGE_ENDPOINTS } from "./endpoints";

// Temporary in-memory mock. Replace with real API calls later using services/api.ts
const mockConversations: Conversation[] = [
  {
    conversation_id: 1,
    user1_id: 10,
    user2_id: 20,
    last_message: "Hey, how are you doing?",
    last_sent_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    unread_count: 3,
    other_user_name: "Alice Johnson",
    other_user_avatar_url: "https://i.pravatar.cc/100?img=1",
  },
  {
    conversation_id: 2,
    user1_id: 10,
    user2_id: 30,
    last_message: "Thanks for the help yesterday!",
    last_sent_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    unread_count: 0,
    other_user_name: "Bob Smith",
    other_user_avatar_url: "https://i.pravatar.cc/100?img=2",
  },
  {
    conversation_id: 3,
    user1_id: 10,
    user2_id: 40,
    last_message: "The project looks great so far",
    last_sent_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    unread_count: 1,
    other_user_name: "Carol Davis",
    other_user_avatar_url: "https://i.pravatar.cc/100?img=3",
  },
];

const mockMessages: Record<ConversationId, Message[]> = {
  1: [
    {
      message_id: 101,
      conversation_id: 1,
      sender_id: 20,
      content: "Hey, how are you doing?",
      sent_at: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      is_read: false,
    },
  ],
  2: [
    {
      message_id: 201,
      conversation_id: 2,
      sender_id: 30,
      content: "Thanks for the help yesterday!",
      sent_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      is_read: true,
    },
  ],
  3: [
    {
      message_id: 301,
      conversation_id: 3,
      sender_id: 40,
      content: "The project looks great so far",
      sent_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      is_read: false,
    },
  ],
};

export async function listConversations(query?: string): Promise<PaginatedResult<Conversation>> {
  try {
    const url = MESSAGE_ENDPOINTS.CONVERSATIONS;
    const params = query ? { search: query } : undefined;
    const res = await axiosInstance.get(url, { params });
    // Expecting { results: Conversation[] } from backend; fallback to mock if not available
    if (Array.isArray(res.data)) {
      return { results: res.data as Conversation[], next: null, previous: null };
    }
    if (res.data?.results) return res.data as PaginatedResult<Conversation>;
  } catch (e) {
    // fall back to mock when backend not ready
  }
  const filtered = !query
    ? mockConversations
    : mockConversations.filter((c) =>
        (c.other_user_name || "").toLowerCase().includes((query || "").toLowerCase()) ||
        (c.last_message || "").toLowerCase().includes((query || "").toLowerCase())
      );
  return { results: filtered, next: null, previous: null };
}

export async function getMessages(conversationId: ConversationId): Promise<Message[]> {
  try {
    const url = MESSAGE_ENDPOINTS.MESSAGES(conversationId);
    const res = await axiosInstance.get(url);
    if (Array.isArray(res.data)) return res.data as Message[];
    if (Array.isArray(res.data?.results)) return res.data.results as Message[];
  } catch (e) {
    // fallback to mock
  }
  return mockMessages[conversationId] || [];
}

export async function sendMessage(
  conversationId: ConversationId,
  content: string,
  senderId: number
): Promise<Message> {
  try {
    const url = MESSAGE_ENDPOINTS.MESSAGES(conversationId);
    const res = await axiosInstance.post(url, { content });
    if (res.data) return res.data as Message;
  } catch (e) {
    // fallthrough to mock below
  }
  const newMessage: Message = {
    message_id: Math.floor(Math.random() * 1000000),
    conversation_id: conversationId,
    content,
    sent_at: new Date().toISOString(),
    is_read: false,
    sender_id: senderId,
  };
  mockMessages[conversationId] = [...(mockMessages[conversationId] || []), newMessage];
  const conv = mockConversations.find((c) => c.conversation_id === conversationId);
  if (conv) {
    conv.last_message = content;
    conv.last_sent_at = newMessage.sent_at;
    conv.unread_count = (conv.unread_count || 0) + 1;
    conv.last_message_sender_id = senderId; // track sender of last message
  }
  return newMessage;
}

export async function updateMessage(
  conversationId: ConversationId,
  messageId: number,
  content: string
): Promise<Message> {
  try {
    const url = MESSAGE_ENDPOINTS.MESSAGE_DETAIL(conversationId, messageId);
    const res = await axiosInstance.put(url, { content });
    if (res.data) return res.data as Message;
  } catch (e) {
    // mock update
  }
  const list = mockMessages[conversationId] || [];
  const idx = list.findIndex((m) => m.message_id === messageId);
  if (idx >= 0) {
    const updated: Message = { ...list[idx], content };
    list[idx] = updated;
    // If this is the last message, update conversation preview
    const conv = mockConversations.find((c) => c.conversation_id === conversationId);
    if (conv) {
      const last = list[list.length - 1];
      if (last && last.message_id === messageId) {
        conv.last_message = content;
        conv.last_sent_at = updated.sent_at;
        // keep last_message_sender_id unchanged (sender didn't change)
      }
    }
    return updated;
  }
  throw new Error("Message not found");
}

export async function deleteMessage(
  conversationId: ConversationId,
  messageId: number
): Promise<void> {
  try {
    const url = MESSAGE_ENDPOINTS.MESSAGE_DETAIL(conversationId, messageId);
    await axiosInstance.delete(url);
    return;
  } catch (e) {
    // mock delete
  }
  const list = mockMessages[conversationId] || [];
  const idx = list.findIndex((m) => m.message_id === messageId);
  if (idx >= 0) {
    const wasLast = idx === list.length - 1;
    list.splice(idx, 1);
    const conv = mockConversations.find((c) => c.conversation_id === conversationId);
    if (conv && wasLast) {
      const newLast = list[list.length - 1];
      conv.last_message = newLast?.content || null;
      conv.last_sent_at = newLast?.sent_at || null;
    }
  }
}

export async function markConversationRead(conversationId: ConversationId): Promise<void> {
  try {
    const url = MESSAGE_ENDPOINTS.MARK_READ(conversationId);
    await axiosInstance.post(url);
    return;
  } catch (e) {
    // mock: mark all messages from others as read
    const list = mockMessages[conversationId] || [];
    list.forEach((m) => (m.is_read = true));
    const conv = mockConversations.find((c) => c.conversation_id === conversationId);
    if (conv) conv.unread_count = 0;
  }
}

// NEW: create or return an existing conversation with another user
export async function getOrCreateConversation(otherUserId: number): Promise<Conversation> {
  try {
    // Server supports create-or-return via POST /conversations
    const url = MESSAGE_ENDPOINTS.CONVERSATIONS;
    const res = await axiosInstance.post(url, { other_user_id: otherUserId });
    return res.data as Conversation;
  } catch (e) {
    // Mock fallback
    const currentUserId = 10; // align with mock user id used elsewhere
    let existing = mockConversations.find(
      (c) =>
        (c.user1_id === currentUserId && c.user2_id === otherUserId) ||
        (c.user1_id === otherUserId && c.user2_id === currentUserId)
    );
    if (existing) return existing;

    const newId =
      (mockConversations.reduce((max, c) => Math.max(max, c.conversation_id), 0) || 0) + 1;

    const newConv: Conversation = {
      conversation_id: newId,
      user1_id: currentUserId,
      user2_id: otherUserId,
      last_message: null,
      last_sent_at: null,
      unread_count: 0,
      other_user_name: `User ${otherUserId}`,
      other_user_avatar_url: undefined as any, // optional
    };
    mockConversations.push(newConv);
    return newConv;
  }
}


