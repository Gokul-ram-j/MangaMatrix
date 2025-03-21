import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import { auth, firestore } from "../../Screens/auth/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  // Fetch user details from Firestore
  const fetchUserData = async () => {
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) throw new Error("No authenticated user found.");

      const userDocRef = doc(firestore, "userDetail", userEmail);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        setUser(userSnapshot.data());
        setUpdatedUser(userSnapshot.data()); // Set editable user data
      } else {
        Alert.alert("User Not Found", "No user details available.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("user");
      Alert.alert("Logged Out", "You have been logged out successfully.");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  // Handle Save (Update Firestore)
  const handleSave = async () => {
    try {
      const userEmail = auth.currentUser?.email;
      if (!userEmail) return;

      const userDocRef = doc(firestore, "userDetail", userEmail);
      await updateDoc(userDocRef, updatedUser);

      setUser(updatedUser); // Update local state
      setEditing(false); // Exit edit mode
      Alert.alert(
        "Profile Updated",
        "Your profile has been successfully updated."
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", error.message);
    }
  };

  // Handle Cancel (Revert Changes)
  const handleCancel = () => {
    setUpdatedUser(user); // Reset changes
    setEditing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#3498db" />
        ) : user ? (
          <>
            {/* User Details */}
            <View style={styles.detailsContainer}>
              {editing ? (
                <View style={styles.editFormContainer}>
                  <Text style={styles.editFormTitle}>Edit Your Profile</Text>

                  <View style={styles.inputContainer}>
                    <MaterialIcons
                      name="person"
                      size={20}
                      color="#3498db"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={updatedUser.name}
                      placeholder="Your Name"
                      placeholderTextColor="#aaa"
                      onChangeText={(text) =>
                        setUpdatedUser({ ...updatedUser, name: text })
                      }
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <MaterialIcons
                      name="date-range"
                      size={20}
                      color="#3498db"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={updatedUser.dob}
                      placeholder="Date of Birth"
                      placeholderTextColor="#aaa"
                      onChangeText={(text) =>
                        setUpdatedUser({ ...updatedUser, dob: text })
                      }
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="transgender"
                      size={20}
                      color="#3498db"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      value={updatedUser.gender}
                      placeholder="Gender"
                      placeholderTextColor="#aaa"
                      onChangeText={(text) =>
                        setUpdatedUser({ ...updatedUser, gender: text })
                      }
                    />
                  </View>

                  <View style={styles.editButtonsContainer}>
                    <TouchableOpacity
                      style={styles.saveButton}
                      onPress={handleSave}
                    >
                      <MaterialIcons name="save" size={20} color="white" />
                      <Text style={styles.buttonText}> Save Changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={handleCancel}
                    >
                      <MaterialIcons name="cancel" size={20} color="white" />
                      <Text style={styles.buttonText}> Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <MaterialIcons name="person" size={20} color="#3498db" />
                    <Text style={styles.infoLabel}>Name:</Text>
                    <Text style={styles.infoValue}>
                      {user.name || "Not Set"}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialIcons
                      name="date-range"
                      size={20}
                      color="#3498db"
                    />
                    <Text style={styles.infoLabel}>DOB:</Text>
                    <Text style={styles.infoValue}>
                      {user.dob || "Not Set"}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <MaterialIcons name="email" size={20} color="#3498db" />
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>
                      {user.email || "Not Set"}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Ionicons name="transgender" size={20} color="#3498db" />
                    <Text style={styles.infoLabel}>Gender:</Text>
                    <Text style={styles.infoValue}>
                      {user.gender || "Not Set"}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setEditing(true)}
                  >
                    <MaterialIcons name="edit" size={16} color="#fff" />
                    <Text style={styles.buttonText}>Edit Profile</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Logout Button (Always visible) */}
            {!editing && (
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <MaterialIcons name="logout" size={16} color="#fff" />
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={50} color="#e74c3c" />
            <Text style={styles.errorText}>User data not found.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 180,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 25,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#3498db",
    backgroundColor: "#e0e0e0",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  detailsContainer: {
    width: "100%",
    maxWidth: 400,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginLeft: 10,
    width: 60,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  editFormContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editFormTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
  },
  editButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#2ecc71",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    maxWidth: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
    marginTop: 10,
  },
});

