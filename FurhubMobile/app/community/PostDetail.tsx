import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  createComment,
  getPosts,
  reactPost,
  reactComment,
  deletePost,
  Post,
  Comment,
}  from "../../services/communityApi";

interface PostDetailProps {
  route: any;
  navigation: any;
}

export default function PostDetail({ route, navigation }: PostDetailProps) {
  const { post, refresh } = route.params as { post: Post; refresh: () => void };
  const userId = 1; // TODO: replace with logged-in user ID

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [commentImage, setCommentImage] = useState<{ uri: string } | null>(null);

  const fetchComments = async () => {
    try {
      const res = await getPosts();
      const updatedPost = res.data.find((p) => p.id === post.id);
      setComments(updatedPost?.comments || []);
    } catch (err) {
      console.log("Fetch comments error:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const pickCommentImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Camera roll permission is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setCommentImage(result.assets[0]);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      return Alert.alert("Error", "Please type a comment!");
    }

    try {
      if (commentImage) {
        const formData = new FormData();
        formData.append("post", post.id.toString());
        formData.append("content", newComment.trim());

        const fileExt = commentImage.uri.split(".").pop()?.toLowerCase() || "jpg";
        formData.append("image", {
          uri: commentImage.uri,
          name: `comment.${fileExt}`,
          type: fileExt === "jpg" ? "image/jpeg" : `image/${fileExt}`,
        } as any);

        await createComment(formData);
      } else {
        await createComment({
          post: post.id,
          content: newComment.trim(),
        });
      }

      setNewComment("");
      setCommentImage(null);
      fetchComments();
      if (refresh) refresh();
    } catch (err: any) {
      console.log("Add comment error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to add comment.");
    }
  };

  const handleReaction = async (type: string, commentId?: number) => {
    try {
      if (commentId) {
        await reactComment(commentId, type);
      } else {
        await reactPost(post.id, type);
      }
      fetchComments();
    } catch (err) {
      console.log("Error reacting:", err);
    }
  };

  const handleDeletePost = async (postId: number) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(postId);
            Alert.alert("Deleted", "Post has been deleted.");
            if (refresh) refresh();
            navigation.goBack();
          } catch (err) {
            console.log("Delete post error:", err);
            Alert.alert("Error", "Failed to delete post.");
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {/* Post */}
      <View style={{ padding: 10, backgroundColor: "#FFF8F0" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{post.title}</Text>
        <Text style={{ marginTop: 5 }}>{post.content}</Text>
        {post.image && (
          <Image
            source={{ uri: post.image.startsWith("http") ? post.image : `http://192.168.43.53:8000${post.image}` }}
            style={{ width: "100%", height: 200, marginTop: 10, borderRadius: 10 }}
          />
        )}
        <Text style={{ marginTop: 5, color: "gray", fontSize: 12 }}>
          {new Date(post.created_at).toLocaleString()}
        </Text>

        {/* Actions */}
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity
            onPress={() => handleReaction("like")}
            style={{ marginRight: 15 }}
          >
            <Text style={{ fontSize: 16, color: "#FF385C" }}>👍</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleReaction("heart")}
            style={{ marginRight: 15 }}
          >
            <Text style={{ fontSize: 16, color: "#FF385C" }}>❤️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReaction("paw")}>
            <Text style={{ fontSize: 16, color: "#FF385C" }}>🐾</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("PostUpdate", { post, refresh })}
            style={{ marginLeft: 10 }}
          >
            <Text style={{ color: "#FFA500", fontWeight: "bold" }}>✏️ Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeletePost(post.id)}
            style={{ marginLeft: 10 }}
          >
            <Text style={{ color: "#FF4500", fontWeight: "bold" }}>🗑 Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Comments */}
      <ScrollView style={{ flex: 1, backgroundColor: "#FFF8F0", padding: 10 }}>
        {comments.map((comment) => (
          <View
            key={comment.id}
            style={{
              backgroundColor: "#FFF0F5",
              padding: 10,
              marginBottom: 10,
              borderRadius: 10,
            }}
          >
            <Text>{comment.content}</Text>
            {comment.image && (
              <Image
                source={{
                  uri: comment.image.startsWith("http")
                    ? comment.image
                    : `http://10.0.0.47:8000${comment.image}`,
                }}
                style={{ width: "100%", height: 150, marginTop: 5, borderRadius: 10 }}
              />
            )}
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <TouchableOpacity onPress={() => handleReaction("like", comment.id)}>
                <Text>👍</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleReaction("heart", comment.id)}>
                <Text>❤️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleReaction("paw", comment.id)}>
                <Text>🐾</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* New Comment */}
        <TextInput
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
          multiline
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
          }}
        />

        {commentImage && (
          <Image
            source={{ uri: commentImage.uri }}
            style={{ width: "100%", height: 150, marginBottom: 10 }}
          />
        )}

        <TouchableOpacity
          onPress={pickCommentImage}
          style={{ backgroundColor: "#FFB347", padding: 12, borderRadius: 10 }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>🖼 Pick Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAddComment}
          style={{
            backgroundColor: "#FF385C",
            padding: 12,
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>🐾 Comment</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
