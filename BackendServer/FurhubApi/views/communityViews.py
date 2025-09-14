from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Post, Comment, Reaction
from ..serializer import PostSerializer, CommentSerializer
from django.apps import apps


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]  # Require login

    def perform_create(self, serializer):
        # Save the logged-in user automatically
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def react(self, request, pk=None):
        post = self.get_object()
        reaction_type = request.data.get('reaction_type')  # 'like', 'heart', or 'paw'

        Reaction = apps.get_model('forum', 'Reaction')
        if reaction_type not in dict(Reaction.REACTION_CHOICES):
            return Response({'error': 'Invalid reaction type'}, status=status.HTTP_400_BAD_REQUEST)

        # Save reaction with logged-in user
        Reaction.objects.create(post=post, user=request.user, reaction_type=reaction_type)

        reactions_count = {
            'like': post.reactions.filter(reaction_type='like').count(),
            'heart': post.reactions.filter(reaction_type='heart').count(),
            'paw': post.reactions.filter(reaction_type='paw').count(),
        }
        return Response(reactions_count)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]  # also require login

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
