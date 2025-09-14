import React, { useState } from "react";
import {
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { updatePost, Post } from "../../services/communityApi";

interface PostUpdateProps {
  route: any;
  navigation: any;
}

export default function PostUpdate({ route, navigation }: PostUpdateProps) {
  const { post, refresh } = route.params as { post: Post; refresh: () => void };

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [image, setImage] = useState<{ uri: string } | null>(
    post.image ? { uri: post.image } : null
  );

  const pickImage = async () => {
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
      setImage(result.assets[0]);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      return Alert.alert("Error", "Title and content cannot be empty.");
    }

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());

      if (image && image.uri && !image.uri.startsWith("http")) {
        const fileExt = image.uri.split(".").pop()?.toLowerCase() || "jpg";
        formData.append("image", {
          uri: image.uri,
          name: `post.${fileExt}`,
          type: fileExt === "jpg" ? "image/jpeg" : `image/${fileExt}`,
        } as any);
      }

      await updatePost(post.id, formData, true);
      Alert.alert("Success", "Post updated successfully!");
      if (refresh) refresh();
      navigation.goBack();
    } catch (err: any) {
      console.log("Update post error:", err.response?.data || err.message);
      Alert.alert("Error", "Failed to update post.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
          Edit Post
        </Text>

        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
          }}
        />

        <TextInput
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            padding: 10,
            marginBottom: 10,
            height: 150,
          }}
        />

        {image && (
          <Image
            source={{ uri: image.uri }}
            style={{ width: "100%", height: 200, borderRadius: 10, marginBottom: 10 }}
          />
        )}

        <TouchableOpacity
          onPress={pickImage}
          style={{
            backgroundColor: "#FFB347",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            🖼 Pick Image
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUpdate}
          style={{
            backgroundColor: "#FF385C",
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            ✏️ Update Post
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
