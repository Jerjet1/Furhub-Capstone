import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.db.models import Q
from .models import Conversation, Message


User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
            self.conversation_group = f"conversation_{conversation_id}"

            self.user = self.scope.get("user")
            print(f"WebSocket Connect: User: {self.user}, Authenticated: {getattr(self.user, 'is_authenticated', False)}")

            # Validate conversation exists
            exists = await self._conversation_exists(conversation_id)
            if not exists:
                print(f"WebSocket Connect: Conversation {conversation_id} does not exist")
                await self.close(code=4404)
                return

            # If authenticated, optionally enforce participant membership
            if getattr(self.user, "is_authenticated", False):
                allowed = await self._user_in_conversation(conversation_id, self.user.id)
                if not allowed:
                    print(f"WebSocket Connect: User {self.user.id} not allowed in conversation {conversation_id}")
                    await self.close(code=4403)
                    return
            else:
                print("WebSocket Connect: User not authenticated, allowing connection anyway")

            await self.channel_layer.group_add(self.conversation_group, self.channel_name)
            await self.accept()
            print(f"WebSocket Connect: Successfully connected to conversation {conversation_id}")
        except Exception as e:
            print(f"WebSocket Connect: Error: {e}")
            await self.close()

    async def disconnect(self, close_code):
        try:
            await self.channel_layer.group_discard(self.conversation_group, self.channel_name)
        except Exception:
            pass

    # python
    async def receive(self, text_data=None, bytes_data=None):
        if not text_data:
            return
        try:
            payload = json.loads(text_data)
            action = payload.get("action")

            if action == "send_message":
                conversation_id = int(payload.get("conversation_id"))
                content = (payload.get("content") or "").strip()
                if not content:
                    return

                # Use the authenticated user as the sender (ignore client payload)
                user = getattr(self, "user", None)
                if getattr(user, "is_authenticated", False):
                    sender_id = user.id
                else:
                    # Fallback only if not authenticated (keeps backward-compat)
                    sender_id = payload.get("sender_id")

                # Ensure sending within the same conversation as the route
                try:
                    route_cid = int(self.scope["url_route"]["kwargs"]["conversation_id"])
                    if route_cid != conversation_id:
                        # Prevent cross-room injection
                        return
                except Exception:
                    pass

                saved = await self._create_message(conversation_id, sender_id, content)
                await self.channel_layer.group_send(
                    self.conversation_group,
                    {
                        "type": "chat.message",
                        "message": saved,
                    },
                )
        except Exception:
            # Optionally send error back
            pass

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event["message"]))

    # DB helpers
    @database_sync_to_async
    def _conversation_exists(self, conversation_id: int) -> bool:
        return Conversation.objects.filter(conversation_id=conversation_id).exists()

    @database_sync_to_async
    def _create_message(self, conversation_id: int, sender_id: int, content: str) -> dict:
        message = Message.objects.create(
            conversation_id=conversation_id,
            sender_id=sender_id,
            content=content,
        )
        return {
            "message_id": message.message_id,
            "conversation_id": message.conversation_id,
            "sender_id": message.sender_id,
            "content": message.content,
            "sent_at": message.sent_at.isoformat(),
            "is_read": message.is_read,
        }

    @database_sync_to_async
    def _user_in_conversation(self, conversation_id: int, user_id: int) -> bool:
        return Conversation.objects.filter(
            conversation_id=conversation_id
        ).filter(
            Q(user1_id=user_id) | Q(user2_id=user_id)
        ).exists()


