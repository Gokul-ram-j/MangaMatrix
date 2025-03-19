import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth } from "../../Screens/auth/firebase"; // Import Firebase auth
import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  // User Data (Mock Data - Replace with Firebase User Data)
  const [user, setUser] = useState({
    name: "John Doe",
    dob: "January 1, 2000",
    email: "johndoe@example.com",
    gender: "Male",
    profilePic: require("../../assets/profile.png"), // Profile image from assets
  });

  // Function to Log Out the User
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase Logout
      await AsyncStorage.removeItem("user"); // Remove user data from AsyncStorage
      Alert.alert("Logged Out", "You have been logged out successfully.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Image */}
      <Image source={user.profilePic} style={styles.profileImage} />

      {/* User Details */}
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.info}>📅 DOB: {user.dob}</Text>
      <Text style={styles.info}>📧 Email: {user.email}</Text>
      <Text style={styles.info}>⚧ Gender: {user.gender}</Text>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#3498db",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginRight: 10,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
