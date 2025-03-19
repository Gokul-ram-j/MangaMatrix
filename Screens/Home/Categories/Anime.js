import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Anime() {
  const [query, setQuery] = useState("");
  const [animeList, setAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to fetch anime (Search or Trending)
  const fetchAnime = async () => {
    setLoading(true);
    try {
      const endpoint = query.trim()
        ? `https://api.jikan.moe/v4/anime?q=${query}&sfw`
        : `https://api.jikan.moe/v4/top/anime`;

      const response = await fetch(endpoint);
      const data = await response.json();

      setAnimeList(data.data || []); // Store anime list or empty array if no results
    } catch (error) {
      console.error("Error fetching anime:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trending anime when the component mounts
  useEffect(() => {
    fetchAnime();
  }, []);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search anime..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={fetchAnime}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#FF6F61"
            style={{ marginTop: 20 }}
          />
        )}

        {/* Anime List */}
        <FlatList
          data={animeList}
          keyExtractor={(item, index) => `${item.mal_id}_${index}`} // Ensure unique keys
          renderItem={({ item }) => (
            <View style={styles.animeBox}>
              <Image
                source={{ uri: item.images.jpg.image_url }}
                style={styles.thumbnail}
              />
              <View style={styles.info}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.genre}>
                  📌 {item.genres?.map((g) => g.name).join(", ") || "N/A"}
                </Text>
                <Text style={styles.description} numberOfLines={3}>
                  {item.synopsis || "No description available."}
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safeContainer: {
    paddingTop:40,
    flex: 1,
    backgroundColor: "#222",
    paddingTop: Platform.OS === "ios" ? 50 : 20, // Ensures it stays within Safe Area
  },
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingVertical: 5,
  },
  searchButton: {
    padding: 10,
    backgroundColor: "#FF6F61",
    borderRadius: 5,
  },
  animeBox: {
    flexDirection: "row",
    backgroundColor: "#444",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  thumbnail: {
    width: 80,
    height: 110,
    borderRadius: 5,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  genre: {
    fontSize: 14,
    color: "#ddd",
    marginVertical: 3,
  },
  description: {
    fontSize: 12,
    color: "#bbb",
  },
});
