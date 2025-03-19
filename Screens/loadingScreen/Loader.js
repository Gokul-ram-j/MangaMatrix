import { View, ActivityIndicator, Text } from "react-native";

const Loader = () => {
  return (
    <View
      style={{
        height:'100%',
        width:'90%',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" />
      <Text
        style={{
          marginTop: 10,
          fontSize: 15,
          fontWeight: "bold",
          textAlign:'center',
          width:'90%',
          marginHorizontal:'auto',
          
        }}
      >
       🌍 "Loading... Making sure you have the best experience!"
      </Text>
    </View>
  );
};

export default Loader;
