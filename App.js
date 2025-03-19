import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View,SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import HomeScreen from "./Screens/Home/HomeScreen";
import LoginScreen from "./Screens/auth/LoginScreen";
import SignUpScreen from "./Screens/auth/SignUpScreen";

export default function App() {
  const [isUserLogged, setIsUserLogged] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLogged(!!user); // True if user is logged in, false otherwise
    });

    return unsubscribe; // Clean up subscription on unmount
  }, []);

  // Tab navigator for the main app flow
  const AppTabs = () => (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          headerShown:false
        }}
      />
      <Tab.Screen
        name="Home1"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          headerShown:false
        }}
      />
      <Tab.Screen
        name="Home2"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          headerShown:false
        }}
      />
      <Tab.Screen
        name="Home3"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
          headerShown:false
        }}
      />
    </Tab.Navigator>
  );

  // Stack navigator for authentication flow
  const AuthStack = () => (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );

  const MainStack = () => (
    <Stack.Navigator
      initialRouteName="AppTabs"
    >
      <Stack.Screen  options={{ headerShown: false }} name="AppTabs" component={AppTabs} />
    </Stack.Navigator>
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        {isUserLogged ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
