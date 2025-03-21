import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from "react-native";
import { firestore } from "../../auth/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const CLIENT_ID = "cf5784fb8be542eaa91a60c0c08253d1";
const CLIENT_SECRET = "d9270c43e6b24522a5ba727361db60aa";
const TOKEN_URL = "https://accounts.spotify.com/api/token";

export default function LatestMusicSearch() {
  const [userEmail, setUserEmail] = useState(null);
  const [latestMusic, setLatestMusic] = useState(null);
  const [similarTracks, setSimilarTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user ? user.email : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const fetchLatestMusic = async () => {
      try {
        const docRef = doc(firestore, "MusicSearches", userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const searchedData = docSnap.data().searchedData || [];
          const lastMusic =
            searchedData.length > 0 ? searchedData[searchedData.length - 1].dataSearched : null;

          if (lastMusic) {
            setLatestMusic(lastMusic);
            fetchSpotifyToken(lastMusic);
          }
        }
      } catch (error) {
        console.error("Error fetching latest music:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestMusic();
  }, [userEmail]);

  const fetchSpotifyToken = async (musicTitle) => {
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
        fetchSimilarMusic(musicTitle, data.access_token);
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const fetchSimilarMusic = async (musicTitle, token) => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(musicTitle)}&type=track&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setSimilarTracks(data.tracks?.items || []);
    } catch (error) {
      console.error("Error fetching similar tracks:", error);
    }
  };

  const playTrack = (spotifyUrl) => {
    Linking.openURL(spotifyUrl).catch((err) => console.error("Error opening Spotify URL:", err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Latest Searched Music</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : userEmail ? (
        <>
          <Text style={styles.musicTitle}>Recent Search : {latestMusic || "No recent searches"}</Text>

          {similarTracks.length > 0 && (
            <FlatList
              data={similarTracks}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.musicCard}>
                  <Image source={{ uri: item.album.images[0]?.url }} style={styles.musicImage} />
                  <Text style={styles.musicName}>{item.name}</Text>
                  <Text style={styles.artistName}>{item.artists[0]?.name}</Text>

                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => playTrack(item.external_urls.spotify)}
                  >
                    <Text style={styles.playButtonText}>Play</Text>
                  </TouchableOpacity>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </>
      ) : (
        <Text style={styles.errorText}>Please sign in to see your searches.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  musicTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 15,
  },
  musicCard: {
    marginRight: 10,
    width: 120,
    alignItems: "center",
  },
  musicImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  musicName: {
    fontSize: 14,
    textAlign: "center",
    color: "black",
    marginTop: 5,
  },
  artistName: {
    fontSize: 12,
    color: "black",
    textAlign: "center",
    fontStyle: "italic",
  },
  playButton: {
    marginTop: 5,
    backgroundColor: "#1DB954",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  playButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
});
