import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./HomeScreen";
import Movies from "./Categories/Movies";
import Music from "./Categories/Music";
import Health from "./Categories/Health";
import Anime from "./Categories/Anime";
import Sports from "./Categories/Sports";
import MovieDetails from "./Categories/MovieDetails";
import WatchMovie from "./Categories/WatchMovie";
import Products from "./Categories/Products";

const Stack = createStackNavigator();

export default function HomeMainStack() {
  return (
      <Stack.Navigator 
        initialRouteName="HomeMain" 
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="HomeMain" component={HomeScreen} />
        <Stack.Screen name="Movies" component={Movies} />
        <Stack.Screen name="MovieDetails" component={MovieDetails} />
        <Stack.Screen name="WatchMovie" component={WatchMovie} />
        <Stack.Screen name="Music" component={Music} />
        <Stack.Screen name="Health" component={Health} />
        <Stack.Screen name="Anime" component={Anime} />
        <Stack.Screen name="Products" component={Products} />
      </Stack.Navigator>
  );
}
