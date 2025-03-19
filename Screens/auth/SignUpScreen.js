import { useState } from "react";
import { Button, Text, TextInput, View, StyleSheet, Image,SafeAreaView } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore as db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

// const logoImg = require("../../assets/logo.png");

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Function to create user document
  const createUserDocument = async (userId, userDetails) => {
    try {
      const userDocRef = doc(db, "userDetails", userId);
      await setDoc(userDocRef, userDetails);
      console.log("User document created successfully!");
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  };
  // handling register
  const handleRegister = () => {
    setError("");
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        createUserDocument(user.email,{community:"",userData:{name:"guest",dob:"N/A",gender:"N/A",profession:"N/A",address:""}});
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const goToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* <Image source={logoImg} style={{ width: 300, height: 100 }} /> */}
      <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
        Welcome! Create your account.
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 5 }}>
        Register
      </Text>
      <TextInput
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.textInput}
      />
      <TextInput
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.textInput}
      />
      <View style={{ width: 250 }}>
        <Button title="Register" onPress={handleRegister} />
      </View>
      {error && <Text style={{ color: "red" }}>{error}</Text>}
      <Text onPress={goToLogin} style={{ marginVertical: 10 }}>
        Already have an account?{" "}
        <Text style={{ color: "rgb(0, 123, 255)" }}>Login here</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    width: 250,
    marginVertical: 10,
    paddingHorizontal: 8,
  },
});
