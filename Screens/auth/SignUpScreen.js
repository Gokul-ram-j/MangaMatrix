import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet 
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../auth/firebase"; // Ensure the path is correct
import { LinearGradient } from "expo-linear-gradient";
import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "../auth/firebase";
export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);


const collections = [
  "AnimeSearches",
  "HealthSearches",
  "MovieSearches",
  "MusicSearches",
  "ProductSearches",
];
const handleSignUp = async () => {
  if (!email || !password || !confirmPassword) {
    Alert.alert("Error", "All fields are required!");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match!");
    return;
  }

  setLoading(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userEmail = email.toLowerCase(); // Ensure case consistency
    await setDoc(doc(firestore,"userDetail",userEmail),{name:'N/A',DOB:'N/A',email:userEmail,gender:'N/A'})
    // Create empty docs in each collection
    await Promise.all(
      collections.map((col) =>
        setDoc(doc(firestore, col, userEmail), { createdAt: new Date().toISOString() ,searchData: []})
      )
    );

    Alert.alert("Success", "Account created successfully! 🎉");
    navigation.navigate("LoginScreen");
  } catch (error) {
    Alert.alert("Error", error.message);
  }
  setLoading(false);
};


  return (
    <LinearGradient colors={["#141E30", "#243B55"]} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Sign Up</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerContainer: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    color: "#fff",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#00ADB5",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  link: {
    color: "#00ADB5",
    marginTop: 15,
  },
});
