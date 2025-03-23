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
import { doc, onSnapshot } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function LatestMovieSearch() {
  const API_KEY = "9fe2c94fca3132fdaf314e87c27876b0";
  const [userEmail, setUserEmail] = useState(null);
  const [latestMovie, setLatestMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserEmail(user ? user.email : null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const docRef = doc(firestore, "MovieSearches", userEmail);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const searchedData = docSnap.data().searchedData || [];
        const lastMovie =
          searchedData.length > 0 ? searchedData[searchedData.length - 1].dataSearched : null;

        setLatestMovie(lastMovie);

        if (lastMovie) {
          fetchSimilarMovies(lastMovie);
        } else {
          setLoading(false);
        }
      } else {
        setLatestMovie(null);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup Firestore listener when unmounting
  }, [userEmail]);

  const fetchSimilarMovies = async (movieTitle) => {
    try {
      setLoading(true);
      const formattedTitle = encodeURIComponent(movieTitle.trim());

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${formattedTitle}&api_key=${API_KEY}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setSimilarMovies(data.results.slice(0, 10));
      } else {
        console.warn("No similar movies found for:", movieTitle);
        setSimilarMovies([]);
      }
    } catch (error) {
      console.error("Error fetching similar movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const openMovieURL = (movieId) => {
    const url = `https://www.themoviedb.org/movie/${movieId}`;
    Linking.openURL(url).catch((err) => console.error("Error opening URL:", err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🎬 Latest Searched Movie</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : userEmail ? (
        <>
          <Text style={styles.movieTitle}>
            Recent Search: {latestMovie || "No recent searches"}
          </Text>

          {similarMovies.length > 0 ? (
            <FlatList
              data={similarMovies}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.movieCard}>
                  <Image
                    source={{
                      uri: item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : "https://via.placeholder.com/100x150.png?text=No+Image",
                    }}
                    style={styles.movieImage}
                  />
                  <Text style={styles.movieName}>{item.title}</Text>

                  <TouchableOpacity
                    style={styles.watchButton}
                    onPress={() => openMovieURL(item.id)}
                  >
                    <Text style={styles.watchButtonText}>Watch</Text>
                  </TouchableOpacity>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
            />
          ) : (
            <Text style={styles.noResultsText}>No similar movies found.</Text>
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
    backgroundColor: "#f8f9fa",
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 15,
  },
  movieTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  movieCard: {
    margin: 10,
    width: 180, // Increased width
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  movieImage: {
    width: 160, // Increased width
    height: 240, // Increased height
    borderRadius: 10,
  },
  movieName: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
  },
  watchButton: {
    marginTop: 8,
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  watchButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
    marginTop: 20,
  },
});

