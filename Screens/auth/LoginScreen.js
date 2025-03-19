import { useEffect, useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  SafeAreaView
} from "react-native";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Loader from "../loadingScreen/Loader";

// const logoImg = require("../../assets/logo.png");

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const checkIfLoggedIn = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("successfully logged in");
      }
    });
  };

  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  const handleLogin = () => {
    setError("");
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setIsLoading(false);
        const user = userCredential.user;
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
        console.log(error)
      });
  };

  const goToRegister = () => {
    navigation.navigate("SignUp");
  };


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {isLoading ? (
        <Loader/>
      ) : (
        <>
          {/* <Image source={logoImg} style={{ width: 300, height: 100 }} /> */}
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Welcome back to our platform!
          </Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 5 }}>
            Login
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
            <Button title="Login" onPress={handleLogin} />
          </View>
          {error && <Text style={{ color: "red" }}>{error}</Text>}
          <Text onPress={goToRegister} style={{ marginVertical: 10 }}>
            Create an account?{" "}
            <Text style={{ color: "rgb(0, 123, 255)" }}>Register here</Text>
          </Text>
        </>
      )}
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
