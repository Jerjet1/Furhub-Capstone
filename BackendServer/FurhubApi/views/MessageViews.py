from django.db.models import Q
from rest_framework import viewsets, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from FurhubApi.models import Conversation, Message, Users
from FurhubApi.serializer import ConversationSerializer, MessageSerializer


class ConversationViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Conversation.objects.filter(Q(user1=user) | Q(user2=user))
        query = self.request.query_params.get("search")
        if query:
            qs = qs.filter(messages__content__icontains=query).distinct()
        return qs

    def create(self, request, *args, **kwargs):
        """Create or get a conversation between the current user and another user"""
        other_user_id = request.data.get('other_user_id')
        if not other_user_id:
            return Response({'error': 'other_user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            other_user = Users.objects.get(id=other_user_id)
        except Users.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if conversation already exists
        conversation = Conversation.objects.filter(
            Q(user1=request.user, user2=other_user) | Q(user1=other_user, user2=request.user)
        ).first()
        
        if conversation:
            serializer = self.get_serializer(conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Create new conversation
        conversation = Conversation.objects.create(
            user1=request.user,
            user2=other_user
        )
        serializer = self.get_serializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def get_or_create(self, request):
        """Get or create a conversation with a specific user"""
        other_user_id = request.query_params.get('other_user_id')
        if not other_user_id:
            return Response({'error': 'other_user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            other_user = Users.objects.get(id=other_user_id)
        except Users.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if conversation already exists
        conversation = Conversation.objects.filter(
            Q(user1=request.user, user2=other_user) | Q(user1=other_user, user2=request.user)
        ).first()
        
        if not conversation:
            # Create new conversation
            conversation = Conversation.objects.create(
                user1=request.user,
                user2=other_user
            )
        
        serializer = self.get_serializer(conversation)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def read(self, request, pk=None):
        """Mark all messages in conversation as read"""
        conversation = self.get_object()
        user = request.user
        
        # Mark all messages from other users as read
        Message.objects.filter(
            conversation=conversation
        ).exclude(sender=user).update(is_read=True)
        
        return Response({'status': 'messages marked as read'}, status=status.HTTP_200_OK)


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        conversation_id = self.kwargs["conversation_pk"]
        
        # Check if conversation exists and user is a participant
        try:
            conversation = Conversation.objects.get(
                Q(conversation_id=conversation_id) & (Q(user1=user) | Q(user2=user))
            )
        except Conversation.DoesNotExist:
            # Return empty queryset if conversation doesn't exist or user not a participant
            return Message.objects.none()
        
        return Message.objects.filter(conversation_id=conversation_id)

    def perform_create(self, serializer):
        conversation_id = self.kwargs["conversation_pk"]
        conversation = Conversation.objects.get(conversation_id=conversation_id)
        serializer.save(conversation=conversation, sender=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.sender_id != request.user.id:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.sender_id != request.user.id:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        return super().destroy(request, *args, **kwargs)



