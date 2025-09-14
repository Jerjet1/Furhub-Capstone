import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

export default function PetProfile() {
  const [petName, setPetName] = useState("");
  const [type, setType] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [photo, setPhoto] = useState(null);
  const [notes, setNotes] = useState("");

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Pet",
      "Are you sure you want to delete this pet profile?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => console.log("Pet Deleted") },
      ]
    );
  };

  const handleSave = () => {
    console.log({ petName, type, breed, age, gender, photo, notes });
    Alert.alert("Success", "Pet profile saved!");
  };

  const handleBackPress = () => {
    // Animate scale down and back up
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      router.replace("/(owner)/Settings/SettingScreen");
    });
  };

  return (
    <View style={styles.container}>
      {/* Animated Paw Back Button */}
      <Animated.View style={[styles.backButtonContainer, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity onPress={handleBackPress}>
          <FontAwesome5 name="paw" size={18} color="#FF6B6B" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Pet Profile</Text>

        <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photo} />
          ) : (
            <Text style={styles.photoText}>Tap to add pet photo 🐾</Text>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Pet Name"
            value={petName}
            onChangeText={setPetName}
          />
          <TextInput
            style={styles.input}
            placeholder="Type (Dog, Cat, etc.)"
            value={type}
            onChangeText={setType}
          />
          <TextInput
            style={styles.input}
            placeholder="Breed"
            value={breed}
            onChangeText={setBreed}
          />
          <TextInput
            style={styles.input}
            placeholder="Age"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
          <TextInput
            style={styles.input}
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
          />
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Special Notes"
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Pet Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.buttonText}>Delete Pet Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  backButtonContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#FFE6E6",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: "center",
    paddingTop: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF6B6B",
    marginBottom: 20,
    textAlign: "center",
  },
  photoContainer: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
    borderRadius: (screenWidth * 0.5) / 2,
    backgroundColor: "#FFE6E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
  },
  photoText: {
    textAlign: "center",
    color: "#FF6B6B",
    padding: 10,
  },
  form: {
    width: "100%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#FFADAD",
    backgroundColor: "#FFF0F5",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#FF6B6B",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF3B3B",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
