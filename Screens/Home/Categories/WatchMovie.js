import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";

export default function WatchMovie() {
  const route = useRoute();
  const { movieUrl } = route.params;

  return (
    <View style={styles.container}>
      <WebView source={{ uri: movieUrl }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
