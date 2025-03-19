import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const API_KEY = "9fe2c94fca3132fdaf314e87c27876b0";
const TMDB_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredMovies, setFilteredMovies] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(TMDB_URL);
        const data = await response.json();

        const moviesWithCast = await Promise.all(
          data.results.map(async (movie) => {
            const castResponse = await fetch(
              `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`
            );
            const castData = await castResponse.json();
            return {
              id: movie.id,
              title: movie.title,
              poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              genre: movie.genre_ids.join(", "),
              overview: movie.overview,
              cast: castData.cast
                .slice(0, 3)
                .map((actor) => actor.name)
                .join(", "),
            };
          })
        );

        setMovies(moviesWithCast);
        setFilteredMovies(moviesWithCast);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      let endpoint = searchText.trim()
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
            searchText
          )}`
        : TMDB_URL;

      const response = await fetch(endpoint);
      const data = await response.json();

      const moviesWithCast = await Promise.all(
        data.results.map(async (movie) => {
          const castResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${API_KEY}`
          );
          const castData = await castResponse.json();
          return {
            id: movie.id,
            title: movie.title,
            poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            genre: movie.genre_ids.join(", "),
            overview: movie.overview,
            cast: castData.cast
              .slice(0, 3)
              .map((actor) => actor.name)
              .join(", "),
          };
        })
      );

      setMovies(moviesWithCast);
      setFilteredMovies(moviesWithCast);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6F61" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor="#bbb"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.movieItem}>
              <Image source={{ uri: item.poster }} style={styles.poster} />
              <View style={styles.details}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.genre}>🎭 {item.genre}</Text>
                <Text style={styles.description} numberOfLines={3}>
                  {item.overview}
                </Text>
                <Text style={styles.cast}>👥 Cast: {item.cast}</Text>
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate("MovieDetails", {
                        movieId: item.id,
                        title: item.title,
                      })
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
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: "#222",
  },
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
    marginTop: 10, // Ensures it stays within SafeAreaView
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  movieItem: {
    flexDirection: "row",
    backgroundColor: "#333",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    alignItems: "center",
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  genre: {
    fontSize: 14,
    color: "#FFD700",
    marginTop: 5,
  },
  description: {
    fontSize: 12,
    color: "#ddd",
    marginTop: 8,
  },
  cast: {
    fontSize: 12,
    color: "#bbb",
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#FF6F61",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 10,
  },
});
