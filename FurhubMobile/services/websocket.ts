import { API_URL } from '../constant/config';
import * as SecureStore from 'expo-secure-store';

export interface WebSocketMessage {
  message_id: number;
  conversation_id: number;
  sender_id: number;
  content: string;
  sent_at: string;
  is_read: boolean;
}

export interface WebSocketPayload {
  action: string;
  conversation_id: number;
  content?: string;
  sender_id?: number;
}

class WebSocketService {
  private ws: WebSocket | null = null;
  private conversationId: number | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private onMessageCallback: ((message: WebSocketMessage) => void) | null = null;
  private onConnectionChangeCallback: ((connected: boolean) => void) | null = null;

  async connect(conversationId: number, onMessage: (message: WebSocketMessage) => void, onConnectionChange: (connected: boolean) => void) {
    this.conversationId = conversationId;
    this.onMessageCallback = onMessage;
    this.onConnectionChangeCallback = onConnectionChange;

    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Convert HTTP URL to WebSocket URL
      const wsUrl = API_URL?.replace('http://', 'ws://').replace('https://', 'wss://');
      const url = `${wsUrl}ws/messages/${conversationId}/?token=${token}`;
      
      console.log('Connecting to WebSocket:', url);
      
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.onConnectionChangeCallback?.(true);
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket message received:', message);
          this.onMessageCallback?.(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        this.onConnectionChangeCallback?.(false);
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
          setTimeout(() => {
            this.connect(conversationId, onMessage, onConnectionChange);
          }, this.reconnectDelay * this.reconnectAttempts);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.onConnectionChangeCallback?.(false);
      };

    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.onConnectionChangeCallback?.(false);
    }
  }

  sendMessage(content: string, senderId: number) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.conversationId) {
      const payload: WebSocketPayload = {
        action: 'send_message',
        conversation_id: this.conversationId,
        content,
        sender_id: senderId,
      };
      
      console.log('Sending WebSocket message:', payload);
      this.ws.send(JSON.stringify(payload));
    } else {
      console.error('WebSocket not connected or conversation ID not set');
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'User disconnected');
      this.ws = null;
    }
    this.conversationId = null;
    this.onMessageCallback = null;
    this.onConnectionChangeCallback = null;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const webSocketService = new WebSocketService();
