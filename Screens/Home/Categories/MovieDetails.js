import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import storeData from "../searchDataStore/storeData";

const API_KEY = "9fe2c94fca3132fdaf314e87c27876b0";

export default function MovieDetails() {
  const route = useRoute();
  const navigation = useNavigation();
  const { movieId, title } = route.params;
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}`
        );
        const data = await response.json();

        const moviesWithPosters = data.results.map((movie) => ({
          id: movie.id,
          title: movie.title,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));

        setRelatedMovies(moviesWithPosters);
      } catch (error) {
        console.error("Error fetching related movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedMovies();
  }, [movieId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6F61" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Related Movies to "{title}"</Text>
      <FlatList
        data={relatedMovies}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.movieItem}>
            <Image source={{ uri: item.poster }} style={styles.poster} />
            <Text style={styles.movieTitle}>{item.title}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>{
                  storeData({db:'MovieSearches',dataSearched:item.title,timeOfSearch:new Date().toISOString().slice(0, 16).replace("T", " "),action:'searched through similar movies'})
                  navigation.navigate("MovieDetails", {
                    movieId: item.id,
                    title: item.title,
                  })
                }
                }
              >
                <Text style={styles.buttonText}>Similar Movies</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("WatchMovie", {
                    movieUrl: `https://www.themoviedb.org/movie/${item.id}`,
                  })
                }
              >
                <Text style={styles.buttonText}>Watch</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  movieItem: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 10,
    margin: 5,
    padding: 10,
    alignItems: "center",
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "column",
    gap:5,
    marginTop: 10,
  },
  button: {
    backgroundColor: "#FF6F61",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign:'center'
  },
});
