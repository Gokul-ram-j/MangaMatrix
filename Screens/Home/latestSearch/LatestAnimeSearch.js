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
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function LatestAnimeSearch() {
  const [userEmail, setUserEmail] = useState(null);
  const [latestAnime, setLatestAnime] = useState(null);
  const [similarAnime, setSimilarAnime] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    // Get logged-in user's email
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const fetchLatestAnime = async () => {
      try {
        const docRef = doc(firestore, "AnimeSearches", userEmail);
        const docSnap = await getDoc(docRef);

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
        }
      } catch (error) {
        console.error("❌ Error fetching latest anime:", error);
        setLoading(false);
      }
    };

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

    fetchLatestAnime();
  }, [userEmail]);

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
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF5733",
    textAlign: "center",
    marginBottom: 10,
  },
  animeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  animeCard: {
    marginRight: 10,
    width: 120,
    alignItems: "center",
  },
  animeImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  animeName: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
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

