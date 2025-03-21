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
  Linking,
} from "react-native";
import storeData from "../searchDataStore/storeData";

const CLIENT_ID = "cf5784fb8be542eaa91a60c0c08253d1"; // Replace with your Spotify Client ID
const CLIENT_SECRET = "d9270c43e6b24522a5ba727361db60aa"; // Replace with your Spotify Client Secret
const TOKEN_URL = "https://accounts.spotify.com/api/token";

function Music() {
  const [searchText, setSearchText] = useState("");
  const [musicData, setMusicData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [showTrending, setShowTrending] = useState(true); // Tracks if we are showing trending music

  useEffect(() => {
    fetchSpotifyToken();
  }, []);

  const fetchSpotifyToken = async () => {
    try {
      const response = await fetch(TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: "grant_type=client_credentials",
      });

      const data = await response.json();
      if (data.access_token) {
        setAccessToken(data.access_token);
        fetchTrendingMusic(data.access_token); // Fetch trending music after getting the token
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  // 🔹 Fetch Trending Songs
  const fetchTrendingMusic = async (token = accessToken) => {
    if (!token) return;

    setLoading(true);
    setShowTrending(true); // Indicate we are showing trending songs

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/browse/new-releases?limit=10",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await response.json();
      if (data.albums?.items?.length > 0) {
        const tracks = data.albums.items.map((album) => ({
          id: album.id,
          name: album.name,
          artist: album.artists[0]?.name || "Unknown Artist",
          external_urls: { spotify: album.external_urls?.spotify || "" },
          album: { images: album.images },
        }));
        setMusicData(tracks);
      } else {
        setMusicData([]);
      }
    } catch (error) {
      console.error("Error fetching trending music:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMusic = async () => {
    if (!searchText.trim()) {
      setShowTrending(true);
      fetchTrendingMusic();
      return;
    }
    storeData({db:'MusicSearches',dataSearched:searchText,timeOfSearch:new Date().toISOString().slice(0, 16).replace("T", " "),action:'searched'})
    if (!accessToken) return;

    setLoading(true);
    setShowTrending(false); // Hide trending songs when searching

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          searchText
        )}&type=track&limit=10`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = await response.json();
      setMusicData(data.tracks?.items || []);
    } catch (error) {
      console.error("Error fetching music:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Open track in Spotify
  const openInSpotify = (track) => {
    const spotifyUrl = track.external_urls?.spotify;
    const searchFallback = `https://open.spotify.com/search/${encodeURIComponent(track.name)}`;

    Linking.openURL(spotifyUrl || searchFallback).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Music..."
          placeholderTextColor="#bbb"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchMusic}>
          <Text style={styles.buttonText}>🔍 Search</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#1DB954" />}

      {showTrending && <Text style={styles.trendingTitle}>🔥 Trending Songs</Text>}

      <FlatList
        data={musicData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.musicItem}>
            <Image
              source={{ uri: item.album.images[0]?.url }}
              style={styles.thumbnail}
            />
            <View style={styles.details}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.artist}>🎤 {item.artist}</Text>
            </View>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() =>{ 
                storeData({db:'MusicSearches',dataSearched:searchText,timeOfSearch:new Date().toISOString().slice(0, 16).replace("T", " "),action:'Played'})
                openInSpotify(item)}}
            >
              <Text style={styles.buttonText}>🎵 Play</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop:50,
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 10,
    color: "#fff",
  },
  searchButton: {
    backgroundColor: "#1DB954",
    padding: 12,
    borderRadius: 10,
    marginLeft: 10,
  },
  trendingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1DB954",
    textAlign: "center",
    marginBottom: 10,
  },
  musicItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  artist: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 2,
  },
  playButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Music;
