import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { firestore } from "../auth/firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import LatestMovieSearch from "../Home/latestSearch/LatestMovieSearch";
import LatestMusicSearch from "../Home/latestSearch/LatestMusicSearch";
import LatestAnimeSearch from "../Home/latestSearch/LatestAnimeSearch";

export default function Explore() {
  const [searchData, setSearchData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  const auth = getAuth();
  const categories = [
    "AnimeSearches",
    "HealthSearches",
    "MovieSearches",
    "MusicSearches",
    "ProductSearches",
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchLatestSearches = async () => {
    if (!userEmail) return;
    setLoading(true);
    try {
      const data = {};
      for (const category of categories) {
        const docRef = doc(firestore, category, userEmail);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const searchedData = docSnap.data().searchedData || [];
          const lastSearch =
            searchedData.length > 0
              ? searchedData[searchedData.length - 1]
              : null;
          data[category] = lastSearch
            ? `${lastSearch.dataSearched} (${lastSearch.action})`
            : "No recent searches";
        } else {
          data[category] = "No recent searches";
        }
      }
      setSearchData(data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestSearches();
  }, [userEmail]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchLatestSearches().then(() => setRefreshing(false));
  }, [userEmail]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Recommendation Based On Latest Searches</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <LatestMusicSearch />
          <LatestMovieSearch />
          <LatestAnimeSearch />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  loader: {
    marginTop: 20,
  },
  searchItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  searchText: {
    fontSize: 14,
    marginTop: 5,
    color: "#333",
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    color: "red",
  },
});

