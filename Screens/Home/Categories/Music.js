import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Audio } from "expo-av";

function Music() {
  const [searchText, setSearchText] = useState("");
  const [musicData, setMusicData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [sound, setSound] = useState(null);
  const [showTrending, setShowTrending] = useState(true);

  useEffect(() => {
    fetchTrendingMusic();
  }, []);

  // 🔹 Search Songs using Deezer API (Fixed)
  const fetchMusic = async () => {
    if (!searchText.trim()) return;

    setLoading(true);
    setShowTrending(false);

    try {
      const response = await fetch(
        `https://api.deezer.com/search?q=${encodeURIComponent(searchText)}`
      );
      const data = await response.json();

      console.log("Search Response:", data); // Debugging

      if (data && data.data) {
        setMusicData(data.data);
      } else {
        setMusicData([]);
      }
    } catch (error) {
      console.error("Error fetching music:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Trending Songs (Deezer Top Charts)
  const fetchTrendingMusic = async () => {
    setLoading(true);
    setShowTrending(true);

    try {
      const response = await fetch("https://api.deezer.com/chart/0/tracks");
      const data = await response.json();

      if (data && data.data) {
        setMusicData(data.data);
      } else {
        setMusicData([]);
      }
    } catch (error) {
      console.error("Error fetching trending music:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Play or Pause Music
  const handlePlayPause = async (track) => {
    if (!track.preview) {
      console.warn("No preview available for this track.");
      return;
    }

    if (playingTrack === track.id) {
      await sound.stopAsync();
      setPlayingTrack(null);
      return;
    }

    if (sound) {
      await sound.unloadAsync();
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: track.preview },
      { shouldPlay: true }
    );

    setSound(newSound);
    setPlayingTrack(track.id);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Music..."
          placeholderTextColor="#bbb"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchMusic}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#FF6F61" />}

      {/* Show "No Results" if no music found */}
      {!loading && musicData.length === 0 && !showTrending && (
        <Text style={styles.noResultsText}>No results found! 🎵</Text>
      )}

      {/* Title for Trending Songs */}
      {showTrending && (
        <Text style={styles.trendingTitle}>🔥 Trending Songs</Text>
      )}

      {/* Music List */}
      <FlatList
        data={musicData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.musicItem}>
            <Image
              source={{ uri: item.album.cover_medium }}
              style={styles.thumbnail}
            />
            <View style={styles.details}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.artist}>🎤 {item.artist.name}</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePlayPause(item)}
            >
              <Text style={styles.buttonText}>
                {playingTrack === item.id ? "⏸ Pause" : "▶ Play"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    backgroundColor: "#222",
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    marginTop: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    color: "#fff",
  },
  searchButton: {
    backgroundColor: "#FF6F61",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trendingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF6F61",
    textAlign: "center",
    marginBottom: 10,
  },
  noResultsText: {
    color: "#FFD700",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  musicItem: {
    flexDirection: "row",
    backgroundColor: "#333",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: "center",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  artist: {
    fontSize: 14,
    color: "#FFD700",
    marginTop: 5,
  },
  button: {
    backgroundColor: "#FF6F61",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
});

export default Music;
