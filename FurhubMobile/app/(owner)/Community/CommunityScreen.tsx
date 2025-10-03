import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { mockPosts, Post, Comment, createPost } from "@/services/forum/mockData";

export default function CommunityScreen() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | undefined>();
  const currentUser = "CurrentUser";

  // Pick image from gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setNewPostImage(result.assets[0].uri);
    }
  };

  // Like a post
  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  // Add comment
  const handleAddComment = (postId: string) => {
    const text = commentTexts[postId];
    if (!text) return;

    const newComment: Comment = { id: Math.random().toString(), user: currentUser, text };

    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
      )
    );

    setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
  };

  // Create new post
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost = createPost(
      { name: currentUser, avatar: "https://randomuser.me/api/portraits/men/10.jpg" },
      newPostContent,
      newPostImage
    );

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setNewPostImage(undefined);
  };

  // Delete own post
  const handleDeletePost = (postId: string) => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setPosts((prev) => prev.filter((p) => p.id !== postId)),
      },
    ]);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View className="bg-white p-4 rounded-xl mb-4 shadow">
      {/* User Info */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Image source={{ uri: item.user.avatar }} className="w-10 h-10 rounded-full mr-2" />
          <View>
            <Text className="font-bold text-gray-800">{item.user.name}</Text>
            <Text className="text-gray-400 text-xs">{item.timestamp}</Text>
          </View>
        </View>

        {item.user.name === currentUser && (
          <TouchableOpacity onPress={() => handleDeletePost(item.id)}>
            <Text className="text-red-500 font-bold">Delete</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Post content */}
      <Text className="text-gray-700 mb-2">{item.content}</Text>
      {item.image && (
        <Image source={{ uri: item.image }} className="w-full h-48 rounded-lg mb-2" />
      )}

      {/* Like & comments */}
      <View className="flex-row justify-between items-center mb-2">
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Text className="text-blue-500 font-bold">❤️ {item.likes} Likes</Text>
        </TouchableOpacity>
        <Text className="text-gray-400">{item.comments.length} Comments</Text>
      </View>

      {/* Comments */}
      {item.comments.map((c) => (
        <Text key={c.id} className="text-gray-600 mb-1">
          <Text className="font-bold">{c.user}: </Text>
          {c.text}
        </Text>
      ))}

      {/* Add comment */}
      <View className="flex-row items-center mt-2">
        <TextInput
          placeholder="Write a comment..."
          value={commentTexts[item.id] || ""}
          onChangeText={(text) =>
            setCommentTexts((prev) => ({ ...prev, [item.id]: text }))
          }
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 mr-2 text-gray-700"
        />
        <TouchableOpacity
          className="bg-blue-500 px-4 py-2 rounded-full"
          onPress={() => handleAddComment(item.id)}
        >
          <Text className="text-white font-bold">Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4 text-center">Pet Community Forum</Text>

      {/* New Post Input */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow">
        <TextInput
          placeholder="What's on your mind?"
          value={newPostContent}
          onChangeText={setNewPostContent}
          className="border border-gray-300 rounded-xl px-4 py-2 mb-2 text-gray-700"
        />

        {newPostImage && (
          <Image source={{ uri: newPostImage }} className="w-full h-48 rounded-lg mb-2" />
        )}

        <View className="flex-row justify-between">
          <TouchableOpacity className="bg-yellow-400 px-4 py-2 rounded-full" onPress={pickImage}>
            <Text className="text-white font-bold">Pick Image</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-full" onPress={handleCreatePost}>
            <Text className="text-white font-bold text-center">Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderPost}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </ScrollView>
  );
}
