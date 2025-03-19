import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  const navigation = useNavigation();

  // Category data with icons
  const categories = [
    { name: "Movies", screen: "Movies", icon: "film-outline" },
    { name: "Music", screen: "Music", icon: "musical-notes-outline" },
    { name: "Health", screen: "Health", icon: "fitness-outline" },
    { name: "Anime", screen: "Anime", icon: "tv-outline" },
    { name: "Products", screen: "Products", icon: "cart-outline" }
  ];

  return (
    <ImageBackground
      source={require("../../assets/bg-gradient.jpg")} // Ensure this file exists
      style={styles.background}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Recommended for You</Text>

        <View style={styles.listContainer}>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.screen}
            numColumns={2} // Two columns for better layout
            columnWrapperStyle={styles.row} // Style for row alignment
            contentContainerStyle={styles.flatList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.box}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["rgba(255, 255, 255, 0.2)", "rgba(255, 255, 255, 0.1)"]}
                  style={styles.gradient}
                >
                  <Ionicons name={item.icon} size={30} color="#fff" />
                  <Text style={styles.text}>{item.name}</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

// Styles
const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  listContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
  },
  flatList: {
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    justifyContent: "center", // Centers the boxes in each row
    alignItems: "center",
  },
  box: {
    width: 150, // Adjust width to fit within two columns
    margin: 10,
    height: 120,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
