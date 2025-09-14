from rest_framework import serializers
from ..models import Post, Comment, Reaction

class CommentSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True, required=False)
    class Meta:
        model = Comment
        fields = '__all__'

class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = ['id', 'reaction_type', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    reactions = ReactionSerializer(many=True, read_only=True)
    image = serializers.ImageField(use_url=True, required=False)
    class Meta:
        model = Post
        fields = '__all__'
