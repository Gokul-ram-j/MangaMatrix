import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { firestore } from "../../auth/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function LatestAnimeSearch() {
  const [userEmail, setUserEmail] = useState(null);
  const [latestAnime, setLatestAnime] = useState(null);
  const [similarAnime, setSimilarAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    // Get logged-in user's email
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    // Real-time listener for latest searched anime
    const docRef = doc(firestore, "AnimeSearches", userEmail);
    const unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const searchedData = docSnap.data().searchedData || [];
        const lastAnime =
          searchedData.length > 0 ? searchedData[searchedData.length - 1].dataSearched : null;

        if (lastAnime) {
          setLatestAnime(lastAnime);
          fetchSimilarAnime(lastAnime);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeSnapshot(); // Cleanup listener
  }, [userEmail]);

  const fetchSimilarAnime = async (animeTitle) => {
    try {
      setLoading(true);
      const formattedTitle = encodeURIComponent(animeTitle.trim());

      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${formattedTitle}&limit=10`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setSimilarAnime(data.data);
      } else {
        console.warn("⚠️ No similar anime found for:", animeTitle);
        setSimilarAnime([]);
      }
    } catch (error) {
      console.error("❌ Error fetching similar anime:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎌 Latest Searched Anime</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF5733" />
      ) : userEmail ? (
        <>
          <Text style={styles.animeTitle}>Recent Search: {latestAnime || "No recent searches"}</Text>

          {similarAnime.length > 0 ? (
            <FlatList
              data={similarAnime}
              horizontal
              keyExtractor={(item) => item.mal_id.toString()}
              renderItem={({ item }) => (
                <View style={styles.animeCard}>
                  <Image
                    source={{
                      uri: item.images.jpg.image_url
                        ? item.images.jpg.image_url
                        : "https://via.placeholder.com/100x150.png?text=No+Image",
                    }}
                    style={styles.animeImage}
                  />
                  <Text style={styles.animeName}>{item.title}</Text>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noResultsText}>No similar anime found.</Text>
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
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF5733",
    textAlign: "center",
    marginBottom: 15,
  },
  animeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  animeCard: {
    margin: 15,
    width: 160, // Increased width for better spacing
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 12, // Rounded corners for a modern look
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // Adds shadow effect for Android
  },
  animeImage: {
    width: 140, // Increased image width
    height: 200, // Increased image height
    borderRadius: 10,
    resizeMode: "cover", // Ensures the image is properly scaled
  },
  animeName: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#BBB",
    marginTop: 20,
  },
});

